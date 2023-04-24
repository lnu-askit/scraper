FROM seakweb/ubuntu-node-python:latest
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN 
WORKDIR /app
COPY . .
WORKDIR /app/api/python
RUN pip3 install -r requirements.txt
RUN pip3 install selenium webdriver_manager
WORKDIR /app/api
RUN npm install
RUN cp example.env .env
RUN echo "SCRAPER_KEY=$SCRAPER_KEY" >| .env

RUN npm run build
CMD ["npm", "run", "start"]