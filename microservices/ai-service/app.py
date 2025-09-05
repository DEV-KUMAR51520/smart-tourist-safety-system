from api.ai_service_api import app, load_models

if __name__ == '__main__':
    # Load models on startup
    load_models()
    
    # Start Flask app
    app.run(host='0.0.0.0', port=5001, debug=False)
