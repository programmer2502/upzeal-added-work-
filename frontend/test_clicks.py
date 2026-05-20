from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Capture console logs
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser error: {err}"))

        print("Navigating to http://localhost:8000...")
        page.goto("http://localhost:8000", wait_until="networkidle")
        
        print("Waiting for transition to finish...")
        time.sleep(3)
        
        print("Clicking 'For Developers' card...")
        # Find the card. The anchor tag has href="#view-student-auth"
        link = page.locator("a[href='#view-student-auth']")
        link.click()
        
        print("Waiting to see what happens...")
        time.sleep(3)
        
        print(f"Current URL: {page.url}")
        
        # Check if the auth view is active
        auth_view = page.locator("#view-student-auth")
        is_visible = auth_view.is_visible()
        classes = auth_view.get_attribute("class")
        print(f"Auth view visible: {is_visible}")
        print(f"Auth view classes: {classes}")

        browser.close()

if __name__ == "__main__":
    run()
