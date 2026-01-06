# This is the most generic and basic bot 
# It uses script that fills in all fields (including honey pot field)
# Since smart bots will already define to only fill in speciefied fields then they wont fall for honey pot

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
    print("--- RUNNING HONEYPOT BOT (The Victim) ---")
    driver.get(TARGET_URL)
    time.sleep(2)

    # 1. FIND AND FILL THE TRAP
    print("Bot: Found 'middle_name' in the HTML code...")
    
    # We use JavaScript because Selenium's .send_keys() will fail on invisible elements.
    # This mimics a bot that posts data directly or modifies the DOM.
    driver.execute_script("document.getElementById('middle_name').value = 'I am a greedy bot';")

    # 2. FILL NORMAL FIELDS
    print("Bot: Filling the rest...")
    driver.find_element(By.XPATH, "//input[@placeholder='Enter Name as per Aadhaar']").send_keys("Honeypot Tester")
    driver.find_element(By.XPATH, "//input[@placeholder='XXXX XXXX XXXX']").send_keys("1234 5678 9012")

    # 3. CLICK LOGIN
    print("Bot: Clicking Login...")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    # 4. WAIT FOR VERDICT
    print("\n--- CHECKING RESULT ---")
    print("You should see the RED POPUP instantly.")
    
    # KEEP BROWSER OPEN until you press Enter in the terminal
    input("\n🔴 TEST DONE. Press Enter in this terminal to close the browser...")

except Exception as e:
    print(f"\n❌ CRASHED: {e}")
    input("Press Enter to close...")

finally:
    driver.quit()