import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

TARGET_URL = "http://localhost:5173"

options = webdriver.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    print("--- RUNNING VAMPIRE BOT (The Background Script) ---")
    driver.get(TARGET_URL)
    time.sleep(2)

    # 1. Fill Fields Normally
    print("Bot: Filling fields...")
    driver.find_element(By.XPATH, "//input[@placeholder='Enter Name as per Aadhaar']").send_keys("Vampire Bot")
    driver.find_element(By.XPATH, "//input[@placeholder='XXXX XXXX XXXX']").send_keys("9999 8888 7777")

    # 2. PLANT THE TIME BOMB
    # We tell the browser to click the button in 3 seconds.
    print("Bot: Planting delayed click (3 seconds)...")
    driver.execute_script("""
        setTimeout(() => {
            document.querySelector('button[type="submit"]').click();
            console.log("CLICK FIRED from background!");
        }, 3000);
    """)

    # 3. HIDE IN THE SHADOWS (Switch Tabs)
    # Immediately switch to a new blank tab so the main tab becomes 'hidden'
    print("Bot: Switching tabs to hide the page...")
    driver.switch_to.new_window('tab')
    
    # 4. WAIT FOR EXPLOSION
    # The click happens now, while we are looking at this blank tab.
    time.sleep(5)

    # 5. RETURN TO SCENE OF CRIME
    print("Bot: Switching back to check result...")
    driver.switch_to.window(driver.window_handles[0])

    print("\n--- CHECK RESULT ---")
    print("You should see the RED POPUP.")
    print("Reason: 'Background Script (Vampire)'")
    
    time.sleep(10)

except Exception as e:
    print(f"Error: {e}")
finally:
    driver.quit()