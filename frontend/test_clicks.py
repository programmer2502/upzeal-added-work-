from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Capture console logs
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser error: {err}"))

        print("Navigating to http://localhost:5173...")
        page.goto("http://localhost:5173", wait_until="networkidle")
        
        print("Waiting for transition to finish...")
        time.sleep(3)
        
        print("Clicking 'Join the Platform' button...")
        join_button = page.locator("button:has-text('Join the Platform')").first
        join_button.click()
        
        print("Waiting to see what happens...")
        time.sleep(3)
        
        print(f"Current URL: {page.url}")
        
        # Check if the signup view is active
        signup_heading = page.locator("h2:has-text('How do you want to use Upzeal?')")
        is_visible = signup_heading.is_visible()
        print(f"Signup view visible: {is_visible}")

        browser.close()

if __name__ == "__main__":
    run()
