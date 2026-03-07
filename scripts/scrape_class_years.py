"""
Scrape class year from Sports Reference team roster pages.
Reads schools from sr_data_2025.csv, fetches each team's roster table,
and outputs sr_class_years_2025.csv with player_sr_link,class columns.
"""

import csv
import re
import time
import requests
from bs4 import BeautifulSoup

SR_CSV = "dashboard/src/app/data/sr_data_2025.csv"
OUTPUT_CSV = "dashboard/src/app/data/sr_class_years_2025.csv"
BASE_URL = "https://www.sports-reference.com/cbb/schools/{school}/women/2025.html"
DELAY = 4  # seconds between requests (match existing scraper's polite delay)


def get_unique_schools(csv_path: str) -> list[str]:
    schools = set()
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            school = row.get("school", "").strip()
            if school:
                schools.add(school)
    return sorted(schools)


def get_player_links_by_school(csv_path: str) -> dict[str, list[dict]]:
    """Group players by school so we can match roster data."""
    by_school: dict[str, list[dict]] = {}
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            school = row.get("school", "").strip()
            link = row.get("player_sr_link", "").strip()
            name = row.get("player_name", "").strip()
            if school and link:
                by_school.setdefault(school, []).append({"link": link, "name": name})
    return by_school


def normalize_name(name: str) -> str:
    """Lowercase, strip accents-ish, collapse whitespace."""
    return re.sub(r"\s+", " ", name.strip().lower())


def scrape_roster(school: str) -> dict[str, str]:
    """Fetch team page and return {player_href_suffix: class_year} from roster table."""
    url = BASE_URL.format(school=school)
    try:
        resp = requests.get(url, timeout=15, headers={"User-Agent": "BSA-Basketball-Research/1.0"})
        if resp.status_code == 429:
            print(f"  RATE LIMITED on {school}. Waiting 60s...")
            time.sleep(60)
            resp = requests.get(url, timeout=15, headers={"User-Agent": "BSA-Basketball-Research/1.0"})
        if resp.status_code != 200:
            print(f"  HTTP {resp.status_code} for {school}")
            return {}
    except Exception as e:
        print(f"  Error fetching {school}: {e}")
        return {}

    html = resp.text

    # Roster table might be inside an HTML comment (SR pattern)
    if 'id="roster"' not in html:
        comments = re.findall(r"<!--(.*?)-->", html, re.DOTALL)
        for comment in comments:
            if 'id="roster"' in comment:
                html = comment
                break

    soup = BeautifulSoup(html, "html.parser")
    roster_table = soup.find("table", id="roster")
    if not roster_table:
        print(f"  No roster table for {school}")
        return {}

    results = {}
    for row in roster_table.select("tbody tr"):
        if row.get("class") and "thead" in row.get("class", []):
            continue

        # Get player link
        player_cell = row.find("th", {"data-stat": "player"}) or row.find("td", {"data-stat": "player"})
        if not player_cell:
            continue
        a_tag = player_cell.find("a")
        if not a_tag or not a_tag.get("href"):
            continue
        href = a_tag["href"]
        full_link = f"https://www.sports-reference.com{href}"

        # Get class year
        class_cell = row.find("td", {"data-stat": "class"})
        if not class_cell:
            continue
        class_val = class_cell.get_text(strip=True)

        if class_val:
            results[full_link] = class_val

    return results


CLASS_MAP = {
    "FR": "Freshman",
    "SO": "Sophomore",
    "JR": "Junior",
    "SR": "Senior",
    "GR": "Graduate",
}


def map_class(raw: str) -> str:
    return CLASS_MAP.get(raw.upper(), raw)


def main():
    schools = get_unique_schools(SR_CSV)
    print(f"Found {len(schools)} unique schools")

    # Collect all class years keyed by player_sr_link
    all_classes: dict[str, str] = {}

    for i, school in enumerate(schools):
        print(f"[{i+1}/{len(schools)}] {school}")
        roster = scrape_roster(school)
        for link, cls in roster.items():
            all_classes[link] = map_class(cls)
        time.sleep(DELAY)

    # Write output
    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["player_sr_link", "class"])
        for link in sorted(all_classes.keys()):
            writer.writerow([link, all_classes[link]])

    print(f"\nDone! Wrote {len(all_classes)} entries to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
