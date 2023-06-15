from bs4 import BeautifulSoup
import requests 
import re
from datetime import date
from pymongo import MongoClient
import time
from datetime import datetime;

##### koniec importów /// początek kodu

def get_soup(url):
    HEADERS = {'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'}
    link = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(link.text, features="html.parser")

    return soup;

def getInternalLinks(soup):
    internalLinks = []

    for link in soup.findAll("a"):
        if link.attrs['href'] is not None:
            if link.attrs['href'] not in internalLinks:
                internalLinks.append(link.attrs['href'])
    return internalLinks

##### koniec ogólnych funkcji /// start meczyków

def meczyki_get_urls(soup):
    tables = soup.findAll('div', class_='matches-table')
    check1 = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1']
    check2 = ['Anglia', 'Hiszpania', 'Niemcy', 'Włochy', 'Francja']
    leagues = []
    urls = []
    
    for table in tables:
        league = table.find('a', class_='url').get_text()
        tab = re.findall(r'\w+', league)
        temp = []
        temp.append(' '.join(tab))
        country = table.find('img', class_='flag')

        if (temp[0] in check1) & (country.attrs['alt'] in check2 ):
            leagues.append(table)

    for league in leagues:
        match_rows = league.findAll('div', class_='match-row')
        
        for row in match_rows:
            url = row.find('a', class_='url')
            if 'href' in url.attrs:
                urls.append('https://www.meczyki.pl'+url.attrs['href'])
    
    for idx, url in enumerate(urls):
        if 'typy-bukmacherskie' in url:
            temp = re.sub('typy-bukmacherskie','wyniki-na-zywo', url)
            urls[idx] = temp     

    return urls;

def meczyki_get_league(soup):
    header = soup.find('div', class_='match-top')
    section = header.findAll('div', class_='section')
    temp = ''

    for sec in section:
        label = sec.find('div', class_='category')
        if (label.get_text()=='Rozgrywki'):
            temp = sec.find('a').get_text()
            break

    league = re.findall(r'\w+', temp)
    league = (' '.join(league))

    return league;

def meczyki_get_teams(soup):
    header = soup.find('div', class_='match-top')
    teams = header.findAll('a', class_='team-name')
    names = []

    for team in teams:
        tab = re.findall(r'\w+', team.get_text())
        names.append(' '.join(tab))

    check = ["Arsenal Londyn", "Brighton Hove", "Liverpool FC", "Brentford FC", "Chelsea Londyn", "Wolverhampton", "Leeds United AFC", "Nottingham Forest FC", "Southampton FC", "FC Barcelona", "Real Madryt", "Atlético Madryt", "Betis Sevilla", "Girona FC", "Celta de Vigo", "Cadiz CF", "Almería", "Espanyol Barcelona", "Elche CF", "Lazio Rzym", "AS Roma", "Inter Mediolan", "Juventus Turyn", "US Sassuolo Calcio", "AC Monza", "Spezia Calcio", "Hellas Verona", "Bayern Monachium", "FC Union Berlin", "RB Lipsk", "SC Freiburg", "FSV Mainz 05", "VfL Wolfsburg", "Borussia M gladbach", "FC Köln", "Werder Brema", "FC Augsburg", "VfL Bochum", "PSG", "Olympique Marsylia", "RC Lens", "AS Monaco", "Stade Rennes", "Olympique Lyon", "Stade de Reims", "Montpellier HSC", "Stade Brestois 29", "RC Strasbourg", "ES Troyes AC", "Angers SCO"]
    output = ["Arsenal", "Brighton Hove Albion", "Liverpool", "Brentford", "Chelsea", "Wolverhampton Wanderers", "Leeds United", "Nottingham Forest", "Southampton", "Barcelona", "Real Madrid", "Atletico Madrid", "Real Betis", "Girona", "Celta Vigo", "Cadiz", "Almeria", "Espanyol", "Elche", "Lazio", "Roma", "Inter", "Juventus", "Sassuolo", "Monza", "Spezia", "Verona", "Bayern Munich", "Union Berlin", "RB Leipzig", "Freiburg", "Mainz", "Wolfsburg", "Borussia Monchengladbach", "FC Cologne", "Werder Bremen", "Augsburg", "Bochum", "Paris Saint-Germain", "Marseille", "Lens", "Monaco", "Rennes", "Lyon", "Reims", "Montpellier", "Brest", "Strasbourg", "Troyes", "Angers"]
  
    for idx, ch in enumerate(check):
        for i, name in enumerate(names):
            if name == ch:
                names[i] = output[idx]

    return names;

def meczyki_get_time(soup):
    header = soup.find('div', class_='match-top')
    rows = header.findAll('div', class_='section')
    time = []
    postp = False;
    ft = False;
    live = False;
    live_min = ''
    ht = False;

    for row in rows:
        if (row.find(string='Data')):
            spans = row.findAll('span')
            for span in spans:
                if (span.find(string="Przerwa")):
                    ht = True
                    break
                if (span.find(string=" (przełożony) ")):
                    postp = True
                    break
                if (span.find(string=" (zakończony) ")):
                    ft = True
                    break
                if (span.find('div', class_='live-icon')):
                    live_min = re.findall(r'[^\s]', span.find('span').get_text())
                    live = True
                    break
                time = re.findall(r'\w+', row.find('span').get_text())
            break

    months_str = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru']
    months_num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']


    date = ''

    # if postp: 
    #     hour = 'Postp.'
    # else:
    #     if ft:  
    #         hour = 'FT'
    #     else:
    #         if live:
    #             hour = (''.join(live_min))
    #         else:  
    #             hour = time[3]+':'+time[4]

    if ft:
        hour = 'FT'
    else:
        if ht:
            hour = 'HT'
        else:
            if live:
                hour = (''.join(live_min))
            else:
                if postp: 
                    hour = 'Postp.'
                else:  
                    hour = time[3]+':'+time[4]

    full_time = []

    for idx, month in enumerate(months_str):
        if time[1] == month:
            date = time[2]+'-'+months_num[idx]+'-'+time[0];
            full_time.append(date) 
            break
    
    full_time.append(hour)
    

    return full_time;    

def meczyki_get_score(soup):
    header = soup.find('div', class_='match-top')
    scores = re.findall(r'\d+', header.find('div', class_='title u-center').get_text())
    if scores == []:
        scores.append('-')
        scores.append('-')

    return scores;

def meczyki_get_possession(soup):
    possession = [50, 50]
    try:
        stats = soup.find('div', class_='stats-body')
        stats_rows = stats.findAll('div', class_='stats-row')

        
        for row in stats_rows:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Posiadanie piłki')):
                possession[0] = (row.find('div', class_='stats-row-left').get_text())
                possession[1] = (row.find('div', class_='stats-row-right').get_text())
                break  
    except:
        print("e")       

    for idx, pos in enumerate(possession):
        temp = re.sub(r'[^0-9]','', str(pos))
        possession[idx] = int(temp)

    return possession;

def meczyki_get_total_shots(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    shots = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Strzały')):
                shots[0] += int(row.find('div', class_='stats-row-left').get_text())
                shots[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue    

    return shots;

def meczyki_get_shots_on_target(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    shots = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Strzały celne')):
                shots[0] += int(row.find('div', class_='stats-row-left').get_text())
                shots[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue    

    return shots;

def meczyki_get_fouls(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    fouls = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Faule')):
                fouls[0] += int(row.find('div', class_='stats-row-left').get_text())
                fouls[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue    

    return fouls;

def meczyki_get_offsides(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    offsides = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Spalone')):
                offsides[0] += int(row.find('div', class_='stats-row-left').get_text())
                offsides[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue    

    return offsides;

def meczyki_get_corners(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    corners = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Rzuty rożne')):
                corners[0] += int(row.find('div', class_='stats-row-left').get_text())
                corners[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue    

    return corners;

def meczyki_get_free_kicks(soup):
    stats = soup.find('div', class_='stats-body')
    stats_rows = stats.findAll('div', class_='stats-row')
    free_kicks = [0, 0]

    for row in stats_rows:
        try:
            stat = row.find('div', class_='stats-row-middle')
            if (stat.find(string='Rzuty wolne')):
                free_kicks[0] += int(row.find('div', class_='stats-row-left').get_text())
                free_kicks[1] += int(row.find('div', class_='stats-row-right').get_text())
                break
        except:
            continue

    return free_kicks;

def meczyki_get_yellow_cards(soup):
    all_events = soup.findAll('div', class_='event-box')
    away_team_events = soup.findAll('div', class_='event-box right')
    total = [0, 0]

    for events in away_team_events:
        away_yellow_cards = events.findAll('i', class_='c-ico c-ico-yc c-ico-16')
        for cards in away_yellow_cards:
            total[1] += 1;
        away_second_yellow_cards = events.findAll('i', class_='c-ico c-ico-y2c c-ico-16')
        for cards in away_second_yellow_cards:
            total[1] += 1;

    for events in all_events:
        all_yellow_cards = events.findAll('i', class_='c-ico c-ico-yc c-ico-16')
        for cards in all_yellow_cards:
            total[0] += 1;
        all_second_yellow_cards = events.findAll('i', class_='c-ico c-ico-y2c c-ico-16')
        for cards in all_second_yellow_cards:
            total[0] += 1;

    total[0] -= total[1];

    return total;  

def meczyki_get_red_cards(soup):
    all_events = soup.findAll('div', class_='event-box')
    away_team_events = soup.findAll('div', class_='event-box right')
    total = [0, 0]

    for events in away_team_events:
        away_red_cards = events.findAll('i', class_='c-ico c-ico-rc c-ico-16')
        for cards in away_red_cards:
            total[1] += 1;
        away_second_yellow_cards = events.findAll('i', class_='c-ico c-ico-y2c c-ico-16')
        for cards in away_second_yellow_cards:
            total[1] += 1;

    for events in all_events:
        all_red_cards = events.findAll('i', class_='c-ico c-ico-rc c-ico-16')
        for cards in all_red_cards:
            total[0] += 1;
        all_second_yellow_cards = events.findAll('i', class_='c-ico c-ico-y2c c-ico-16')
        for cards in all_second_yellow_cards:
            total[0] += 1;

    total[0] -= total[1];

    return total; 

##### koniec meczyków /// początek livescores

def livescores_get_urls(soup):
    internalLinks = getInternalLinks(soup)
    allIntLinks = []
    check1 = ['/football/england/premier-league/', '/football/spain/laliga-santander/', '/football/italy/serie-a/', '/football/germany/bundesliga/', '/football/france/ligue-1/']
    check2 = ['/football/spain/laliga-santander/?tz=2', '/football/italy/serie-a/?tz=2', '/football/germany/bundesliga/?tz=2', '/football/france/ligue-1/?tz=2', '/football/england/premier-league/?tz=2',
              '/football/spain/laliga-santander/', '/football/italy/serie-a/', '/football/germany/bundesliga/', '/football/france/ligue-1/', '/football/england/premier-league/']
    
    for link in internalLinks:
        for ch in check1:
            if ch in link:
                if (link not in allIntLinks) & (link not in check2):
                    allIntLinks.append('https://www.livescores.com/'+link+'&tab=statistics') 

    return allIntLinks;

def livescores_get_league(soup):
    link = soup.findAll('link')
    check = ['premier-league', 'laliga-santander', 'bundesliga', 'serie-a', 'ligue-1']
    output = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1']
    league = ''


    for l in link:
        if 'livescores.com' in l.attrs['href']:
            for idx, ch in enumerate(check):
                if ch in l.attrs['href']:
                    league = output[idx];
 
    return league;

def livescores_get_teams(soup):
    header = soup.find('div', class_='fe ie he')
    if header is None:
        header = soup.find('div', class_='fe ie')
    teams = []
    teams.append(header.find('span', class_='ke'))
    teams.append(header.find('span', class_='le'))
    names = []

    for team in teams:
        tab = re.findall(r'\w+', team.get_text())
        names.append(' '.join(tab))

    return names;

def livescores_get_time(soup):
    header = soup.find('div', class_='fe ie he')
    if header is None:
        header = soup.find('div', class_='fe ie')
    full_time = []
    full_time.append(str(date.today()))
    full_time.append(header.find('span', class_='ge').get_text())

    return full_time;  

def livescores_get_score(soup):
    header = soup.find('div', class_='fe ie he')
    if header is None:
        header = soup.find('div', class_='fe ie')
    header_mid = header.find('div', class_='me')
    result = header_mid.findAll('span')
    scores = []

    for res in result:
        temp = re.findall(r'\d+', res.get_text())
        for t in temp:
            scores.append(t)

    if scores == []:
        scores.append('-')
        scores.append('-')

    return scores;

def livescores_get_possession(soup):
    stats_rows = soup.findAll('div', class_='De')
    possession = [50, 50]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Possession (%)')):
            possession[0] = int(row.find('span', class_='Ae').get_text())
            possession[1] = int(row.find('span', class_='Be').get_text())
            break

    return possession;

def livescores_get_shots_on_target(soup):
    stats_rows = soup.findAll('div', class_='De')
    shots = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Shots on target')):
            shots[0] += int(row.find('span', class_='Ae').get_text())
            shots[1] += int(row.find('span', class_='Be').get_text())
            break

    return shots;    

def livescores_get_total_shots(soup):
    stats_rows = soup.findAll('div', class_='De')
    shots_off = [0, 0]
    blocked = [0, 0]
    sum = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Shots off target')):
            shots_off[0] += int(row.find('span', class_='Ae').get_text())
            shots_off[1] += int(row.find('span', class_='Be').get_text())

        if (stat.find(string='Blocked Shots')):
            blocked[0] += int(row.find('span', class_='Ae').get_text())
            blocked[1] += int(row.find('span', class_='Be').get_text())            

    for idx, shots in enumerate(shots_off):
        sum[idx] += ( int(shots) + int(blocked[idx]) + int(livescores_get_shots_on_target(soup)[idx]) )


    return sum;      

def livescores_get_fouls(soup):
    stats_rows = soup.findAll('div', class_='De')
    fouls = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Fouls')):
            fouls[0] += int(row.find('span', class_='Ae').get_text())
            fouls[1] += int(row.find('span', class_='Be').get_text())
            break

    return fouls;  

def livescores_get_offsides(soup):
    stats_rows = soup.findAll('div', class_='De')
    offsides = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Offsides')):
            offsides[0] += int(row.find('span', class_='Ae').get_text())
            offsides[1] += int(row.find('span', class_='Be').get_text())
            break

    return offsides;      

def livescores_get_corners(soup):
    stats_rows = soup.findAll('div', class_='De')
    corners = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Corner Kicks')):
            corners[0] += int(row.find('span', class_='Ae').get_text())
            corners[1] += int(row.find('span', class_='Be').get_text())
            break

    return corners;     

def livescores_get_yellow_cards(soup):
    stats_rows = soup.findAll('div', class_='De')
    cards = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Yellow cards')):
            cards[0] += int(row.find('span', class_='Ae').get_text())
            cards[1] += int(row.find('span', class_='Be').get_text())
        if (stat.find(string='Yellow red cards')):
            cards[0] += int(row.find('span', class_='Ae').get_text())
            cards[1] += int(row.find('span', class_='Be').get_text())   

    return cards;         

def livescores_get_red_cards(soup):
    stats_rows = soup.findAll('div', class_='De')
    cards = [0, 0]

    for row in stats_rows:
        stat = row.find('div', class_='Ge')
        if (stat.find(string='Red cards')):
            cards[0] += int(row.find('span', class_='Ae').get_text())
            cards[1] += int(row.find('span', class_='Be').get_text())
            break


    return cards;      

##### koniec livescores /// początek programu (integracja z eksportem)

def get_database():
    uri = "xxx"
    # deleted uri
    client = MongoClient(uri)
    # try:
    #     client.admin.command('ping')
    #     print("Pinged your deployment. You successfully connected to MongoDB!")
    # except Exception as e:
    #     print(e)
    return client['upscores']

def meczyki_get_data():
    meczyki_soup = get_soup("https://www.meczyki.pl/wyniki-na-zywo")
    meczyki_urls = meczyki_get_urls(meczyki_soup)    
    meczyki_data = []

    for url in meczyki_urls:
        # time.sleep(1);
        soup = get_soup(url)
        temp = []
        temp.append(meczyki_get_league(soup))
        temp.append(meczyki_get_teams(soup))
        temp.append(meczyki_get_time(soup))
        temp.append(meczyki_get_score(soup))
        temp.append(meczyki_get_possession(soup))
        temp.append(meczyki_get_total_shots(soup))
        temp.append(meczyki_get_shots_on_target(soup))
        temp.append(meczyki_get_fouls(soup))
        temp.append(meczyki_get_offsides(soup))
        temp.append(meczyki_get_corners(soup))
        temp.append(meczyki_get_yellow_cards(soup))
        temp.append(meczyki_get_red_cards(soup))
        # temp.append(meczyki_get_free_kicks(get_soup(url)))
        meczyki_data.append(temp)   

    return meczyki_data

def livescores_get_data():
    livescores_soup = get_soup("https://www.livescores.com/?tz=2")
    livescores_urls = livescores_get_urls(livescores_soup)
    livescores_data = []

    for url in livescores_urls:
        # time.sleep(1);
            soup = get_soup(url)
            temp = []
            temp.append(livescores_get_league(soup))
            temp.append(livescores_get_teams(soup))
            temp.append(livescores_get_time(soup))
            temp.append(livescores_get_score(soup))
            temp.append(livescores_get_possession(soup))
            temp.append(livescores_get_total_shots(soup))
            temp.append(livescores_get_shots_on_target(soup))
            temp.append(livescores_get_fouls(soup))
            temp.append(livescores_get_offsides(soup))
            temp.append(livescores_get_corners(soup))
            temp.append(livescores_get_yellow_cards(soup))
            temp.append(livescores_get_red_cards(soup))
            livescores_data.append(temp)      

    return livescores_data

def integrate():
    final_data = []

    with open('check.txt', 'r') as f:
        line = f.readline()
        if line == "1":
            final_data = meczyki_get_data()
            line = line.replace('1', '0')
            # print("requesting meczyki...")
        else:
            final_data = livescores_get_data()
            line = line.replace('0', '1')
            # print("requesting livescores...")
    f.close()

    with open('check.txt', 'w') as f:
        f.write(line)
    f.close()

    return final_data

def export(data):
    #data pattern: ["league", [home, away], [date, time], [h_goals, a_goals], [h_poss, a_poss], [h_shots, a_shots], [h_ontarget, a_ontarget], [h_fouls, a_fouls], [h_offsides, a_offsides], [h_corners, a_corners],
                    # [h_yellows, a_yellows], [h_reds, a_reds]]     

    dbname = get_database()
    collection_name = dbname["matches"]

    for d in data:  
        id =  d[1][0].replace(' ', '-')+'_'+d[1][1].replace(' ', '-')+'_'+d[2][0]
        if collection_name.count_documents({"_id" : id}) > 0:
            collection_name.replace_one({"_id" : id}, {
                "_id" : id,
                "date" : d[2][0],
                "time" : d[2][1],
                "league" : d[0],
                "home_team" : d[1][0],
                "away_team" : d[1][1],
                "home_goals" : d[3][0],
                "away_goals" : d[3][1],
                "home_possession" : d[4][0],
                "away_possession" : d[4][1],
                "home_shots" : d[5][0],
                "away_shots" : d[5][1],
                "home_ontarget" : d[6][0],
                "away_ontarget" : d[6][1],
                "home_fouls" : d[7][0],
                "away_fouls" : d[7][1],
                "home_offsides" : d[8][0],
                "away_offsides" : d[8][1],
                "home_corners" : d[9][0],
                "away_corners" : d[9][1],  
                "home_yellow_cards" : d[10][0],
                "away_yellow_cards" : d[10][1],   
                "home_red_cards" : d[11][0],
                "away_red_cards" : d[11][1],        
                })
        else:     
            doc = {
                "_id" : id,
                "date" : d[2][0],
                "time" : d[2][1],
                "league" : d[0],
                "home_team" : d[1][0],
                "away_team" : d[1][1],
                "home_goals" : d[3][0],
                "away_goals" : d[3][1],
                "home_possession" : d[4][0],
                "away_possession" : d[4][1],
                "home_shots" : d[5][0],
                "away_shots" : d[5][1],
                "home_ontarget" : d[6][0],
                "away_ontarget" : d[6][1],
                "home_fouls" : d[7][0],
                "away_fouls" : d[7][1],
                "home_offsides" : d[8][0],
                "away_offsides" : d[8][1],
                "home_corners" : d[9][0],
                "away_corners" : d[9][1],  
                "home_yellow_cards" : d[10][0],
                "away_yellow_cards" : d[10][1],   
                "home_red_cards" : d[11][0],
                "away_red_cards" : d[11][1],  
            }
            collection_name.insert_one(doc)

##### koniec programu // początek dodatkowych funkcji (do uzupełniania bazy danych)

from datetime import timedelta

def livescores_get_yesterday_time(soup):
    header = soup.find('div', class_='fe ie he')
    if header is None:
        header = soup.find('div', class_='fe ie')
    full_time = []
    full_time.append(str(date.today()-timedelta(days = 1)))
    full_time.append(header.find('span', class_='ge').get_text())

    return full_time;  

def meczyki_get_timetable(soup):
    tables = soup.findAll('table', class_='matches-wrapper')
    urls = []
    
    for table in tables:
        temp = table.findAll('td', class_='status')
        for t in temp:
            href = t.find('a')
            if 'href' in href.attrs:
                urls.append('https://www.meczyki.pl'+href.attrs['href'])
    
    for idx, url in enumerate(urls):
        if 'typy-bukmacherskie' in url:
            temp = re.sub('typy-bukmacherskie','wyniki-na-zywo', url)
            urls[idx] = temp     

    return urls;

def meczyki_get_previous_data():
    meczyki_soup = get_soup("https://www.meczyki.pl/ligue-1,16,terminarz")
    meczyki_urls = meczyki_get_timetable(meczyki_soup)    
    meczyki_data = []

    for url in meczyki_urls:
        time.sleep(1);
        soup = get_soup(url)
        temp = []
        temp.append(meczyki_get_league(soup))
        temp.append(meczyki_get_teams(soup))
        temp.append(meczyki_get_time(soup))
        temp.append(meczyki_get_score(soup))
        temp.append(meczyki_get_possession(soup))
        temp.append(meczyki_get_total_shots(soup))
        temp.append(meczyki_get_shots_on_target(soup))
        temp.append(meczyki_get_fouls(soup))
        temp.append(meczyki_get_offsides(soup))
        temp.append(meczyki_get_corners(soup))
        temp.append(meczyki_get_yellow_cards(soup))
        temp.append(meczyki_get_red_cards(soup))
        # temp.append(meczyki_get_free_kicks(get_soup(url)))
        meczyki_data.append(temp)   

    return meczyki_data

def livescores_get_yesterday_data():
    link = "https://www.livescores.com/football/"+str(date.today()-timedelta(days = 1))+"/?tz=2"
    livescores_soup = get_soup(link)
    livescores_urls = livescores_get_urls(livescores_soup)
    livescores_data = []

    for url in livescores_urls:
        # time.sleep(1);
            soup = get_soup(url)
            temp = []
            temp.append(livescores_get_league(soup))
            temp.append(livescores_get_teams(soup))
            temp.append(livescores_get_yesterday_time(soup))
            temp.append(livescores_get_score(soup))
            temp.append(livescores_get_possession(soup))
            temp.append(livescores_get_total_shots(soup))
            temp.append(livescores_get_shots_on_target(soup))
            temp.append(livescores_get_fouls(soup))
            temp.append(livescores_get_offsides(soup))
            temp.append(livescores_get_corners(soup))
            temp.append(livescores_get_yellow_cards(soup))
            temp.append(livescores_get_red_cards(soup))
            livescores_data.append(temp)      

    return livescores_data

def export_old(data):
    #data pattern: ["league", [home, away], [date, time], [h_goals, a_goals], [h_poss, a_poss], [h_shots, a_shots], [h_ontarget, a_ontarget], [h_fouls, a_fouls], [h_offsides, a_offsides], [h_corners, a_corners],
                    # [h_yellows, a_yellows], [h_reds, a_reds]]     

    dbname = get_database()
    collection_name = dbname["matches"]

    for d in data:
        if datetime.strptime(d[2][0], '%Y-%m-%d').date() < date.today():
            id =  d[1][0].replace(' ', '-')+'_'+d[1][1].replace(' ', '-')+'_'+d[2][0]
            if collection_name.count_documents({"_id" : id}) > 0:
                collection_name.replace_one({"_id" : id}, {
                    "_id" : id,
                    "date" : d[2][0],
                    "time" : d[2][1],
                    "league" : d[0],
                    "home_team" : d[1][0],
                    "away_team" : d[1][1],
                    "home_goals" : d[3][0],
                    "away_goals" : d[3][1],
                    "home_possession" : d[4][0],
                    "away_possession" : d[4][1],
                    "home_shots" : d[5][0],
                    "away_shots" : d[5][1],
                    "home_ontarget" : d[6][0],
                    "away_ontarget" : d[6][1],
                    "home_fouls" : d[7][0],
                    "away_fouls" : d[7][1],
                    "home_offsides" : d[8][0],
                    "away_offsides" : d[8][1],
                    "home_corners" : d[9][0],
                    "away_corners" : d[9][1],  
                    "home_yellow_cards" : d[10][0],
                    "away_yellow_cards" : d[10][1],   
                    "home_red_cards" : d[11][0],
                    "away_red_cards" : d[11][1],  
                })   
                    
            else:     
                doc = {
                    "_id" : id,
                    "date" : d[2][0],
                    "time" : d[2][1],
                    "league" : d[0],
                    "home_team" : d[1][0],
                    "away_team" : d[1][1],
                    "home_goals" : d[3][0],
                    "away_goals" : d[3][1],
                    "home_possession" : d[4][0],
                    "away_possession" : d[4][1],
                    "home_shots" : d[5][0],
                    "away_shots" : d[5][1],
                    "home_ontarget" : d[6][0],
                    "away_ontarget" : d[6][1],
                    "home_fouls" : d[7][0],
                    "away_fouls" : d[7][1],
                    "home_offsides" : d[8][0],
                    "away_offsides" : d[8][1],
                    "home_corners" : d[9][0],
                    "away_corners" : d[9][1],  
                    "home_yellow_cards" : d[10][0],
                    "away_yellow_cards" : d[10][1],   
                    "home_red_cards" : d[11][0],
                    "away_red_cards" : d[11][1],  
                }
                collection_name.insert_one(doc)

##### koniec dodatkowych funkcji // początek testów

export(integrate())

# export_old(livescores_get_yesterday_data())

# export_old(meczyki_get_previous_data())

# db = get_database()
# collection_name = db["Matches"]
# collection_name.delete_many({"away_team" : "Brighton Hove"})

# db = get_database()
# collection_name = db["Matches"]
# docs = collection_name.find({"date" : "2023-04-22"})
# for doc in docs:
#     print (doc['home_team']+" "+doc['home_goals'] +":"+ doc['away_goals']+" "+doc['away_team'])
