// content.js
(function() {
    'use strict';

    // 1. 取得 URL 中的 prompt 參數
    const params = new URLSearchParams(window.location.search);
    const promptText = params.get('prompt') || params.get('q'); // 支援 ?prompt= 或 ?q=

    // 如果沒有 prompt 參數，就什麼都不做
    if (!promptText) return;

    // 2. 定義尋找並填入輸入框的函式
    function fillGeminiInput() {
        // Gemini 的輸入框通常是一個 contenteditable 的 div
        // 選取器：role="textbox" 且 contenteditable="true"
        const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
        console.log(inputBox);
        if (inputBox) {
            // 確保輸入框已準備好 (有時候元素存在但尚未綁定事件)
            // 先聚焦
            inputBox.focus();

            // 設定內容
            // Gemini 的編輯器通常會把文字包在 <p> 標籤內，但直接純文字通常也能運作
            // 為了保險，我們先清空再填入
            inputBox.textContent = promptText; 
            console.log('Gemini Prompt Prefill: 成功填入文字');
            return true; // 成功
        }
        return false; // 尚未找到
    }

    // 3. 嘗試執行
    // 由於 Gemini 是 SPA (單頁應用)，載入速度不一，我們使用輪詢 (Polling) 直到找到輸入框
    let attempts = 0;
    const maxAttempts = 20; // 最多嘗試 10 秒 (20 * 500ms)
    
    const intervalId = setInterval(() => {
        attempts++;
        const success = fillGeminiInput();
        
        if (success || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 500); // 每 0.5 秒檢查一次

})();