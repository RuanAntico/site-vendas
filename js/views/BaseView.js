/**
 * BaseView - Classe base para todas as views
 * Contém métodos comuns de manipulação da DOM
 */
class BaseView {
    /**
     * Mostra uma página e esconde as outras
     */
    mostrarPagina(pageId) {
        const paginas = [
            'loginPage', 'servicoPage', 'tipoPessoaPage',
            'pessoaFisicaPage', 'pessoaJuridicaPage',
            'adminPage', 'clientPage'
        ];
        paginas.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.classList.remove('ativo');
                elemento.style.display = 'none';
            }
        });
        const pagina = document.getElementById(pageId);
        if (pagina) {
            pagina.classList.add('ativo');
            pagina.style.display = 'flex';
        }
    }

    /**
     * Exibe uma mensagem ao usuário
     */
    mostrarMensagem(texto, tipo = 'success') {
        const oldMessages = document.querySelectorAll('.message');
        oldMessages.forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message ${tipo}`;
        const iconClass = tipo === 'success' ? 'check-circle' : 'exclamation-circle';
        message.innerHTML = `<i class="fas fa-${iconClass}"></i> ${texto}`;

        const card = document.querySelector('.card');
        if (card) {
            card.insertBefore(message, card.firstChild);
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        }
    }

    /**
     * Obter valor de um elemento do formulário
     */
    obterValor(elementId) {
        const elemento = document.getElementById(elementId);
        return elemento ? elemento.value : '';
    }

    /**
     * Limpar um formulário
     */
    limparFormulario(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    /**
     * Validar se campo está vazio
     */
    validarCamposObrigatorios(ids) {
        for (let id of ids) {
            if (!this.obterValor(id)) {
                return false;
            }
        }
        return true;
    }
}
