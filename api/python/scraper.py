import os
import queue
import sys

from scripts.cleaner import clean_content
from scripts.json_handler import write_to_json
from scripts.scrape_page import scrape_content, scrape_links
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

options = Options()
options.add_argument("--disable-gpu")
options.add_argument("--headless")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()), options=options
)

entryLinks = [
    "https://serviceportalen.lnu.se/sv-se",  # Start page
    "https://serviceportalen.lnu.se/sv-se/category/698987",  # Guider/FAQ
]

# scrape_content("https://serviceportalen.lnu.se/sv-se")
linkQueue = queue.Queue()
for link in entryLinks:
    linkQueue.put(link)
scrapedLinks = set()
articleLinks = set()
maxCount = (
    int(sys.argv[1]) or 10
)  # Change to adjust maximum number of pages to scrape
outDir = "workfiles"

if not os.path.exists(outDir):
    os.makedirs(outDir)

print("Running scraper with maxCount: " + str(maxCount))

while not linkQueue.empty() and articleLinks.__len__() <= maxCount:
    link = linkQueue.get()
    if link not in scrapedLinks:
        scrapedLinks.add(link)
        print("# Scraping links from: " + link)
        print("# Queue size: " + str(linkQueue.qsize()))
        print("# Scraped links (total): " + str(scrapedLinks.__len__()))
        print("# Article urls found: " + str(articleLinks.__len__()))
        try:
            linkDict = scrape_links(link, driver)
            for link in linkDict["articleLinks"]:
                if link not in scrapedLinks:
                    articleLinks.add(link)
                    linkQueue.put(link)
            for link in linkDict["categoryLinks"]:
                if link not in scrapedLinks:
                    linkQueue.put(link)
        except:
            print("Error scraping links from: " + link + "\nMoving on to next...")

articleDict = {"articleLinks": []}

for link in articleLinks:
    articleDict["articleLinks"].append(link)

resultDict = {"informationBlobs": []}

while articleLinks.__len__() != 0:
    link = articleLinks.pop()
    try:
        print(" Scraping content from: " + link)
        infoBlob = scrape_content(link, driver)
        infoBlob["content"] = clean_content(infoBlob["content"])
        resultDict["informationBlobs"].append(infoBlob)
    except:
        print("Error scraping content from: " + link + "\nMoving on to next...")

write_to_json(articleDict, outDir + "/article_links.json")
write_to_json(resultDict, outDir + "/raw_info.json")

driver.quit()
