const API_BASE_URL = 'http://localhost:5000';

export async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {

            const errorData = response.headers.get('Content-Type')?.includes('application/json') ? await response.json() : { message: response.statusText };
            throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, error);
        showMessage(`Não foi possível carregar os dados. Detalhes: ${error.message}`, 'error');
        return null;
    }
}

export async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = response.headers.get('Content-Type')?.includes('application/json') ? await response.json() : { message: response.statusText };
            throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao enviar dados para ${endpoint}:`, error);
        showMessage(`Erro ao cadastrar. Detalhes: ${error.message}`, 'error');
        return null;
    }
}

export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export function isValidCpfCnpj(doc) {
    const cleanedDoc = doc.replace(/\D/g, '');
    if (cleanedDoc.length === 11 || cleanedDoc.length === 14) {
        return true;
    }
    return false;
}


export function showMessage(message, type = 'error') {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.classList.add(type === 'error' ? 'error-message' : 'success-message');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        animation: fadeOut 5s forwards;
    `;
    if (type === 'error') {
        msgDiv.style.backgroundColor = '#e74c3c';
    } else {
        msgDiv.style.backgroundColor = '#2ecc71';
    }
    document.body.appendChild(msgDiv);

    const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet;
    if (!styleSheet.cssRules || !Array.from(styleSheet.cssRules).some(rule => rule.name === 'fadeOut')) {
        styleSheet.insertRule(`
            @keyframes fadeOut {
                0% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `, styleSheet.cssRules.length);
    }

    setTimeout(() => msgDiv.remove(), 5000);
}