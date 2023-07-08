.PHONY: install
install:
	python3 -m venv venv
	. venv/bin/activate; pip install fastapi uvicorn python-dotenv openai

.PHONY: requirements
requirements:
	. venv/bin/activate; pip freeze > requirements.txt

.PHONY: run
run:
	. venv/bin/activate; uvicorn main:app --reload
