import re
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from scripts.cleaner import clean_content


def scrape_links(url, driver):
    driver.get(url)
    try:
        wait = WebDriverWait(driver, 10)
        element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "img")))
        time.sleep(1)
        if element:
            print("Page loaded: " + url)
    finally:
        result = {"categoryLinks": [], "articleLinks": []}
        links = driver.find_elements(By.TAG_NAME, "a")
        print(f"Found {len(links)} links")
        for link in links:
            try:
                currentHref = link.get_attribute("href")
                if "https://serviceportalen.lnu.se" in currentHref:
                    if "article" in currentHref:
                        result["articleLinks"].append(currentHref)
                    if "category" in currentHref:
                        result["categoryLinks"].append(currentHref)
            except:
                print("Error getting link")
        return result


def scrape_content(url, driver):
    driver.get(url)
    try:
        wait = WebDriverWait(driver, 10)
        element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "img")))
        time.sleep(1)
        if element:
            print("Page loaded: " + url)
    finally:
        title = driver.find_element(By.TAG_NAME, "h1").text
        content = driver.find_element(By.CLASS_NAME, "layout-article").text
        content = clean_content(content)
        return {
            "title": title,
            "content": content,
            "url": url,
        }
