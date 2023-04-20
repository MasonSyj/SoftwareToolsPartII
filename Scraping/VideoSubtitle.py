from bs4 import BeautifulSoup
import requests

html_text = requests.get('https://web.microsoftstream.com/video/99c10922-d2fa-4a82-8098-4f779ea026e8?referrer=https:%2F%2Fcs-uob.github.io%2F').text

print(html_text)

soup = BeautifulSoup(html_text, 'lxml')

titles = soup.find_all('h1', class_='title ng-binding')

subtitles = soup.find_all('div', class_='transcript-text new ng-binding')

print(titles)

print(subtitles)