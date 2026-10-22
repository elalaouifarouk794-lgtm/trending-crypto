import ccxt
import time
import google.generativeai as genai

# 1. إعدادات Binance Testnet (مجاني 100% وبلا وثائق)
exchange = ccxt.binance({
    'apiKey': 'حط_هنا_API_Key_ديال_Testnet',
    'secret': 'حط_هنا_Secret_Key_ديال_Testnet',
    'enableRateLimit': True,
    'options': {'defaultType': 'spot'}
})

# تفعيل رابط الـ Testnet
exchange.set_sandbox_mode(True)

# 2. إعدادات Gemini AI
genai.configure(api_key='حط_هنا_Gemini_API_Key')
model = genai.GenerativeModel('gemini-1.5-flash')

symbol = 'BTC/USDT'
investment_amount_usdt = 50  # مبلغ تجريبي لكل صفقة

def analyze_market_with_ai():
    try:
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe='1h', limit=10)
        prompt = f"Analyze these BTC prices: {ohlcv}. Reply with ONLY one word: BUY, SELL, or HOLD."
        
        response = model.generate_content(prompt)
        decision = response.text.strip().upper()
        print(f"🤖 AI Decision for {symbol}: {decision}")
        return decision
    except Exception as e:
        print(f"Error analyzing market: {e}")
        return "HOLD"

def execute_trading_bot():
    print("🚀 AI Trading Agent (Testnet) is ACTIVE & Running 24/7...")
    while True:
        decision = analyze_market_with_ai()
        
        if "BUY" in decision:
            try:
                ticker = exchange.fetch_ticker(symbol)
                current_price = ticker['last']
                amount_to_buy = investment_amount_usdt / current_price
                
                order = exchange.create_market_buy_order(symbol, amount_to_buy)
                print(f"✅ SUCCESSFUL TEST BUY ORDER: {order}")
            except Exception as e:
                print(f"❌ Order Error: {e}")
                
        elif "SELL" in decision:
            print("📉 AI status: Waiting for next opportunity...")
            
        time.sleep(3600)  # يحلل السوق كل ساعة

if __name__ == "__main__":
    execute_trading_bot()
