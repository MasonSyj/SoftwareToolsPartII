from bs4 import BeautifulSoup
import os

with open('home.html', 'r') as html:
    content = html.read()

    soup = BeautifulSoup(content, 'lxml')
    course_cards = soup.find_all('div', class_='card' )

    for card in course_cards:
        print(card.h5)
    print("----------------------------------------")

    for card in course_cards:
        print(card)
    print("----------------------------------------")

    for card in course_cards:
        card.name = card.h5.text
        card.price = card.a.text.split()[-1]
        # print(card.name)
        # print(card.price)
        print(f'{card.name} costs {card.price}')

