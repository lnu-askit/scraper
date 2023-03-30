import queue

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from scripts.cleaner import clean_content
from scripts.json_handler import write_to_json
from scripts.scrape_page import scrape_content, scrape_links

options = Options()
options.add_argument("--window-size=1920,1200")
options.add_argument("--headless")

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
maxCount = 400  # Change to adjust maximum number of pages to scrape

while not linkQueue.empty() and articleLinks.__len__() <= maxCount:
    link = linkQueue.get()
    if link not in scrapedLinks:
        scrapedLinks.add(link)
        print("# Scraping links from: " + link)
        print("# Queue size: " + str(linkQueue.qsize()))
        print("# Scraped links (total): " + str(scrapedLinks.__len__()))
        print("# Article urls found: " + str(articleLinks.__len__()))
        linkDict = scrape_links(link, driver)
        for link in linkDict["articleLinks"]:
            if link not in scrapedLinks:
                articleLinks.add(link)
                linkQueue.put(link)
        for link in linkDict["categoryLinks"]:
            if link not in scrapedLinks:
                linkQueue.put(link)


articleDict = {"articleLinks": []}

for link in articleLinks:
    articleDict["articleLinks"].append(link)

write_to_json(articleDict, "workfiles/article_links.json")

resultDict = {"informationBlobs": []}

while articleLinks.__len__() != 0:
    link = articleLinks.pop()
    try:
        print(" Scraping content from: " + link)
        infoBlob = scrape_content(link, driver)
        infoBlob["content"] = clean_content(infoBlob["content"])
        resultDict["informationBlobs"].append(infoBlob)
    except Exception as e:
        print("Error scraping content from: " + link)
        print(str(e))

write_to_json(resultDict, "workfiles/raw_info.json")

driver.quit()
