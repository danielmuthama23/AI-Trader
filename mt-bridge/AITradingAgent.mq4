//+------------------------------------------------------------------+
//|  AI Trading Agent Expert Advisor v2.0 — MT4/MT5 ZeroMQ Bridge   |
//+------------------------------------------------------------------+
#property copyright "AI Trading Agent"
#property version   "2.00"
#include <Zmq/Zmq.mqh>

extern string  ServerIP    = "localhost";
extern int     PushPort    = 6789;
extern int     PullPort    = 6790;
extern int     MagicNumber = 20260613;
extern double  LotSize     = 0.01;
extern int     Slippage    = 3;
extern bool    AllowBuy    = true;
extern bool    AllowSell   = true;
extern bool    AutoTrade   = true;

Context context("AITradingAgent");
Socket  pushSocket(context, ZMQ_PUSH);
Socket  pullSocket(context, ZMQ_PULL);
string  lastSignal = "";
datetime lastCheck = 0;

int OnInit() {
   pushSocket.connect(StringFormat("tcp://%s:%d", ServerIP, PushPort));
   pullSocket.bind(StringFormat("tcp://*:%d", PullPort));
   Print("AI Agent started. Server: ", ServerIP);
   SendMsg("{\"type\":\"heartbeat\",\"ea\":\"AITradingAgent\"}");
   return INIT_SUCCEEDED;
}

void OnTick() {
   if (TimeCurrent() - lastCheck < 5) return;
   lastCheck = TimeCurrent();
   string tick = StringFormat(
      "{\"pair\":\"%s\",\"bid\":%.5f,\"ask\":%.5f,\"spread\":%.1f,\"rsi\":%.2f,\"balance\":%.2f}",
      Symbol(), Bid, Ask, (Ask-Bid)/Point, iRSI(Symbol(),0,14,PRICE_CLOSE,0), AccountBalance());
   SendMsg(tick);
   ZmqMsg reply;
   if (pullSocket.recv(reply, true)) {
      string signal = reply.getData();
      if (signal != lastSignal) { lastSignal = signal; if (AutoTrade) Process(signal); }
   }
}

void Process(string json) {
   if (StringFind(json,"\"action\":\"BUY\"")>=0  && AllowBuy)  OpenTrade(OP_BUY);
   if (StringFind(json,"\"action\":\"SELL\"")>=0 && AllowSell) OpenTrade(OP_SELL);
   if (StringFind(json,"\"action\":\"CLOSE\"")>=0) CloseAll();
}

void OpenTrade(int type) {
   double price = type==OP_BUY ? Ask : Bid;
   double sl    = type==OP_BUY ? price-50*Point : price+50*Point;
   double tp    = type==OP_BUY ? price+100*Point : price-100*Point;
   int ticket   = OrderSend(Symbol(),type,LotSize,price,Slippage,sl,tp,"AI-Agent",MagicNumber,0,type==OP_BUY?clrGreen:clrRed);
   if (ticket>0) Print("Trade opened #", ticket);
   else Print("Error: ", GetLastError());
}

void CloseAll() {
   for (int i=OrdersTotal()-1; i>=0; i--) {
      if (OrderSelect(i,SELECT_BY_POS) && OrderMagicNumber()==MagicNumber)
         OrderClose(OrderTicket(),OrderLots(),OrderType()==OP_BUY?Bid:Ask,Slippage,clrOrange);
   }
}

void SendMsg(string msg) { ZmqMsg m(msg); pushSocket.send(m,true); }
void OnDeinit(const int reason) { pushSocket.disconnect(StringFormat("tcp://%s:%d",ServerIP,PushPort)); context.destroy(); }
