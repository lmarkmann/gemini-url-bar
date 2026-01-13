// content.js
(function() {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    let promptText = params.get('q');

    if (!promptText) return;

    // Check if prompt starts with 1, 2, or 3 followed by space
    let modelType = 'Thinking'; // default
    const modelMatch = promptText.match(/^([123])\s+(.*)$/);

    if (modelMatch) {
        const modelNum = modelMatch[1];
        promptText = modelMatch[2];

        if (modelNum === '1') modelType = 'Fast';
        else if (modelNum === '3') modelType = 'Pro';
    }

    const needsModelChange = modelType !== 'Thinking';

    function selectModel() {
        // Find the model selector button - it's near the input area and contains model name
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            // Look for the button that has .mode-title inside or contains model text
            const modeTitle = btn.querySelector('.mode-title');
            if (modeTitle) {
                btn.click();
                setTimeout(selectModelOption, 1);
                return true;
            }
            // Fallback: button with model name text
            const text = btn.textContent || '';
            if ((text.includes('Fast') || text.includes('Thinking') || text.includes('Pro'))
                && btn.closest('.input-area-container, .prompt-container, [class*="input"]')) {
                btn.click();
                setTimeout(selectModelOption, 1);
                return true;
            }
        }
        return false;
    }

    function selectModelOption() {
        // Find menuitemradio buttons with the target model
        const options = document.querySelectorAll('[role="menuitemradio"]');

        for (const option of options) {
            const titleEl = option.querySelector('.mode-title');
            const text = titleEl ? titleEl.textContent.trim() : option.textContent;

            if (text.includes(modelType)) {
                option.click();
                console.log(`Gemini Prompt Prefill: Selected model - ${modelType}`);
                return true;
            }
        }

        document.body.click();
        return false;
    }

    function fillGeminiInput() {
        const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
        if (inputBox) {
            inputBox.focus();
            inputBox.textContent = promptText;
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                const sendButton = document.querySelector('button[aria-label*="Send"], button[aria-label*="傳送"]');
                if (sendButton) {
                    sendButton.click();
                    console.log('Gemini Prompt Prefill: Auto-send triggered');
                }
            }, 1);
            return true;
        }
        return false;
    }

    if (needsModelChange) {
        let modelAttempts = 0;
        const modelIntervalId = setInterval(() => {
            modelAttempts++;
            if (selectModel() || modelAttempts >= 20) {
                clearInterval(modelIntervalId);
                setTimeout(startFilling, 1);
            }
        }, 1);
    } else {
        startFilling();
    }

    function startFilling() {
        let inputAttempts = 0;
        const inputIntervalId = setInterval(() => {
            inputAttempts++;
            if (fillGeminiInput() || inputAttempts >= 20) {
                clearInterval(inputIntervalId);
            }
        }, 1);
    }

})();
