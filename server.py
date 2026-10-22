from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# حالة الـ AI الوهمية أو الحقيقية
bot_status = {
    "status": "Running 24/7 (Sleeping Mode)",
    "last_action": "BUY BTC @ $82,250",
    "profit": "+$45.20"
}

@app.route('/api/bot-status', methods=['GET'])
def get_bot_status():
    return jsonify(bot_status)

if __name__ == '__main__':
    app.run(port=5000)
