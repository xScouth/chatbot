document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // GANTI DENGAN URL WEBHOOK DARI N8N ANDA
    const n8nWebhookUrl = 'https://n8n-production-3ba7.up.railway.app/webhook/538d2a42-ba09-46b8-b2ce-3334a1b6e50e';

    // Fungsi untuk mengirim pesan
    const sendMessage = async () => {
        const userText = userInput.value.trim();
        if (userText === '') return;

        // Tampilkan pesan pengguna di chat box
        appendMessage(userText, 'user');
        userInput.value = '';

        // Tampilkan indikator loading (opsional)
        appendMessage('...', 'bot', true);

        try {
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hapus indikator loading
            removeLoadingIndicator();
            
            // Tampilkan balasan dari bot
            // Sesuaikan 'data.reply' dengan struktur JSON yang Anda kirim dari n8n
            const botReply = data.reply || "Maaf, terjadi kesalahan saat memproses balasan.";
            appendMessage(botReply, 'bot');

        } catch (error) {
            console.error("Error fetching from n8n:", error);
            removeLoadingIndicator();
            appendMessage("Mohon maaf, layanan sedang tidak tersedia. Silakan coba lagi nanti.", 'bot');
        }
    };

    // Fungsi untuk menambahkan pesan ke chat box
    function appendMessage(text, type, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${type}-message`);
        if (isLoading) {
            messageDiv.id = 'loading-indicator';
        }
        
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        chatBox.appendChild(messageDiv);

        // Auto-scroll ke pesan terbaru
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fungsi untuk menghapus indikator loading
    function removeLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Event listener untuk tombol kirim
    sendBtn.addEventListener('click', sendMessage);

    // Event listener untuk tombol 'Enter' di input field
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
