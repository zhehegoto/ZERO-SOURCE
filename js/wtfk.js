(function () {
    'use strict';

    // ===== 创建 DOM =====
    const overlay = document.createElement('div');
    overlay.className = 'fw-widget-overlay';
    overlay.innerHTML = `
        <div class="fw-widget-panel">
            <div class="fw-chat-header">
                <div class="fw-chat-avatar"><i class="fa fa-headphones"></i></div>
                <div class="fw-chat-info">
                    <div class="fw-chat-name">零源小助手</div>
                    <div class="fw-chat-status"><span class="fw-status-dot"></span> 在线</div>
                </div>
                <button class="fw-chat-close" id="fwCloseBtn">&times;</button>
            </div>
            <div class="fw-chat-messages" id="fwMessages"></div>
            <div class="fw-quick-replies" id="fwQuickReplies"></div>
            <div class="fw-input-area">
                <div class="fw-input-row">
                    <input type="text" class="fw-chat-input" id="fwInput" placeholder="输入你的回复..." autocomplete="off">
                    <button class="fw-send-btn" id="fwSendBtn"><i class="fa fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const fab = document.createElement('button');
    fab.className = 'fw-widget-btn pulse';
    fab.innerHTML = '<i class="fa fa-headphones"></i>';
    fab.setAttribute('title', '问题反馈');
    document.body.appendChild(fab);

    // ===== 元素引用 =====
    const messagesEl = overlay.querySelector('#fwMessages');
    const inputEl = overlay.querySelector('#fwInput');
    const sendBtn = overlay.querySelector('#fwSendBtn');
    const quickEl = overlay.querySelector('#fwQuickReplies');
    const closeBtn = overlay.querySelector('#fwCloseBtn');

    // ===== 对话状态 =====
    let currentStep = 'name';
    let feedbackData = { name: '', contact: '', type: '', description: '' };
    let chatStarted = false;

    const typeMap = { bug: '功能异常', suggestion: '功能建议', other: '其他' };

    // ===== 弹窗开关 =====
    function openChat() {
        overlay.classList.add('active');
        fab.classList.remove('pulse');
        if (!chatStarted) {
            chatStarted = true;
            startConversation();
        }
        setTimeout(() => inputEl.focus(), 400);
    }

    function closeChat() {
        overlay.classList.remove('active');
    }

    fab.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeChat();
    });

    // ===== 添加消息 =====
    function addMessage(text, type, isHTML) {
        const msg = document.createElement('div');
        msg.className = `fw-message ${type === 'bot' ? 'fw-bot' : 'fw-user'}`;
        if (type === 'bot') {
            msg.innerHTML = `
                <div class="fw-msg-avatar"><i class="fa fa-robot"></i></div>
                <div class="fw-msg-bubble">${isHTML ? text : escapeHtml(text)}</div>
            `;
        } else {
            msg.innerHTML = `<div class="fw-msg-bubble">${escapeHtml(text)}</div>`;
        }
        messagesEl.appendChild(msg);
        scrollBottom();
        return msg;
    }

    function showTyping() {
        const msg = document.createElement('div');
        msg.className = 'fw-message fw-bot';
        msg.id = 'fwTypingMsg';
        msg.innerHTML = `
            <div class="fw-msg-avatar"><i class="fa fa-robot"></i></div>
            <div class="fw-msg-bubble">
                <div class="fw-typing"><span></span><span></span><span></span></div>
            </div>
        `;
        messagesEl.appendChild(msg);
        scrollBottom();
    }

    function hideTyping() {
        const t = document.getElementById('fwTypingMsg');
        if (t) t.remove();
    }

    function botReply(text, delay, isHTML) {
        return new Promise(resolve => {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage(text, 'bot', isHTML);
                resolve();
            }, delay || 800);
        });
    }

    function scrollBottom() {
        setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
    }

    function setQuickReplies(options) {
        quickEl.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'fw-quick-btn';
            btn.textContent = opt.label;
            btn.addEventListener('click', () => handleInput(opt.value, opt.label));
            quickEl.appendChild(btn);
        });
    }

    function clearQuick() { quickEl.innerHTML = ''; }

    function setInput(enabled, placeholder) {
        inputEl.disabled = !enabled;
        sendBtn.disabled = !enabled;
        if (placeholder) inputEl.placeholder = placeholder;
        if (enabled) inputEl.focus();
    }

    // ===== 输入处理 =====
    async function handleInput(value, displayText) {
        const text = displayText || value;
        addMessage(text, 'user');
        clearQuick();
        setInput(false);

        switch (currentStep) {
            case 'name': await handleName(value); break;
            case 'contact': await handleContact(value); break;
            case 'type': await handleType(value); break;
            case 'description': await handleDescription(value); break;
            case 'confirm': await handleConfirm(value); break;
            case 'done': if (value === 'again') resetChat(); break;
        }
    }

    async function handleName(value) {
        const name = value.trim();
        if (!name || name.length < 2) {
            await botReply('称呼至少需要2个字哦，请重新输入~');
            setInput(true, '请输入你的称呼...');
            return;
        }
        feedbackData.name = name;
        currentStep = 'contact';
        await botReply(`好的，${name}！请留下你的联系方式（邮箱或电话），方便我们回复你。`);
        setInput(true, '请输入邮箱或电话...');
    }

    async function handleContact(value) {
        const contact = value.trim();
        if (!contact || contact.length < 5) {
            await botReply('联系方式格式不太对哦，请重新输入~');
            setInput(true, '请输入邮箱或电话...');
            return;
        }
        feedbackData.contact = contact;
        currentStep = 'type';
        await botReply('收到！请问反馈类型是？');
        setQuickReplies([
            { label: '功能异常', value: 'bug' },
            { label: '功能建议', value: 'suggestion' },
            { label: '其他', value: 'other' }
        ]);
        setInput(false);
    }

    async function handleType(value) {
        feedbackData.type = value;
        currentStep = 'description';
        await botReply(`好的，是关于"${typeMap[value] || value}"的反馈。请详细描述你的问题或建议，越详细越好~`);
        setInput(true, '请详细描述...');
    }

    async function handleDescription(value) {
        const desc = value.trim();
        if (!desc || desc.length < 10) {
            await botReply('描述至少需要10个字哦，这样我们才能更好地了解问题~');
            setInput(true, '请详细描述...');
            return;
        }
        feedbackData.description = desc;
        currentStep = 'confirm';

        const confirmHTML = `
            <div style="margin-bottom:6px;font-weight:600;">确认一下信息：</div>
            <div style="font-size:0.8rem;line-height:1.9;color:#666;">
                <div><strong>称呼：</strong>${escapeHtml(feedbackData.name)}</div>
                <div><strong>联系：</strong>${escapeHtml(feedbackData.contact)}</div>
                <div><strong>类型：</strong>${typeMap[feedbackData.type] || feedbackData.type}</div>
                <div><strong>描述：</strong>${escapeHtml(feedbackData.description.substring(0, 50))}${feedbackData.description.length > 50 ? '...' : ''}</div>
            </div>
            <div style="margin-top:6px;">确认提交吗？</div>
        `;
        await botReply(confirmHTML, 800, true);
        setQuickReplies([
            { label: '确认提交', value: 'submit' },
            { label: '重新填写', value: 'restart' }
        ]);
        setInput(false);
    }

    async function handleConfirm(value) {
        if (value === 'restart') {
            await botReply('好的，我们重新开始~');
            resetChat();
            return;
        }
        if (value === 'submit') {
            await botReply('正在生成文件，请稍候...');
            showTyping();

            const feedbackText = [
                '===== 零源机构反馈记录 =====',
                `提交时间：${new Date().toLocaleString('zh-CN')}`,
                `称呼：${feedbackData.name}`,
                `联系方式：${feedbackData.contact}`,
                `反馈类型：${typeMap[feedbackData.type] || feedbackData.type}`,
                '',
                '反馈内容：',
                feedbackData.description,
                '',
                '===== 记录结束 ====='
            ].join('\n');

            try {
                const encrypted = await encryptText(feedbackText);
                downloadEncrypted(encrypted);
                setTimeout(() => {
                    hideTyping();
                    currentStep = 'done';
                    addMessage('文件已经生成，请发送给：辙嗬', 'bot');
                    setQuickReplies([{ label: '再来一次', value: 'again' }]);
                    setInput(false);
                }, 800);
            } catch (err) {
                hideTyping();
                await botReply('加密失败，请重试~');
                setQuickReplies([{ label: '重新填写', value: 'restart' }]);
            }
        }
    }

    // ===== AES-GCM 加密 =====
    const SECRET_KEY = 'Z3R0-L1nk-S3cur3-K3y-2025-X9m7';

    async function getAesKey() {
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(SECRET_KEY),
            { name: 'PBKDF2' }, false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: new TextEncoder().encode('Z3R0-SALT-2025'), iterations: 100000, hash: 'SHA-256' },
            keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
        );
    }

    async function encryptText(plainText) {
        const key = await getAesKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(plainText)
        );
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);
        let binary = '';
        for (let i = 0; i < combined.length; i++) binary += String.fromCharCode(combined[i]);
        return btoa(binary);
    }

    function downloadEncrypted(encryptedBase64) {
        const content = 'ZEROFB2\n' + encryptedBase64;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${Date.now()}.zfb`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== 重置/开始 =====
    function resetChat() {
        messagesEl.innerHTML = '';
        clearQuick();
        feedbackData = { name: '', contact: '', type: '', description: '' };
        currentStep = 'name';
        startConversation();
    }

    async function startConversation() {
        setInput(false);
        await botReply('你好！我是零源小助手，很高兴收到你的反馈。请问怎么称呼你？', 600);
        setInput(true, '请输入你的称呼...');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== 事件绑定 =====
    sendBtn.addEventListener('click', () => {
        const value = inputEl.value.trim();
        if (value && !inputEl.disabled) {
            handleInput(value);
            inputEl.value = '';
        }
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const value = inputEl.value.trim();
            if (value && !inputEl.disabled) {
                handleInput(value);
                inputEl.value = '';
            }
        }
    });
})();
