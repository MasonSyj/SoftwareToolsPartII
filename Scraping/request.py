from bs4 import BeautifulSoup
import requests

html_text = requests.get('https://www.reed.co.uk/jobs/it-jobs-in-bristol').text

# print(html_text)

soup = BeautifulSoup(html_text, 'lxml')

# jobs = soup.find_all('article', class_='job-result-card')
jobs = soup.find_all('div', class_='col-xs-12 col-sm-8 col-md-9 details')

# print(soup.find('div', class_='col-xs-12 col-sm-8 col-md-9 details'))
# print(jobs)

for job in jobs:
    # print(job)
    title = job.find('h2', class_='job-result-heading__title')
    title_name = title.find('a').text
    salary = job.find('li', class_='job-metadata__item job-metadata__item--salary').text
    link = job.find('a', class_='gtmJobListingPostedBy')
    linkaddress = "Not Provided"
    if 'href' in link.attrs:
        linkaddress = link['href']

    print(title_name.strip())
    print(salary.strip())
    print(linkaddress)
    print('-------------------------')
