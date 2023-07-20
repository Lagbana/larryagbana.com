.PHONY: install
install:
	python3 -m venv venv
	. venv/bin/activate; pip install -r requirements.txt

.PHONY: requirements
requirements:
	. venv/bin/activate; pip freeze > requirements.txt

.PHONY: run
run:
	. venv/bin/activate; uvicorn main:app --reload

.PHONY: format
format:
	black ./
