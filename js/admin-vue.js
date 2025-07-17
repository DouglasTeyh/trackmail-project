import { fetchData, postData, isValidEmail, isValidCpfCnpj, showMessage } from './main.js';


const ClientesComponent = {
    template: `
        <div>
            <h2>Gerenciar Clientes</h2>
            <form @submit.prevent="cadastrarCliente">
                <div class="form-group">
                    <label for="clienteNome">Nome Completo:</label>
                    <input type="text" id="clienteNome" v-model="novoCliente.nome" required>
                </div>
                <div class="form-group">
                    <label for="clienteCpfCnpj">CPF/CNPJ:</label>
                    <input type="text" id="clienteCpfCnpj" v-model="novoCliente.cpfCnpj" required>
                </div>
                <div class="form-group">
                    <label for="clienteEmail">E-mail:</label>
                    <input type="email" id="clienteEmail" v-model="novoCliente.email" required>
                </div>
                <div class="form-group">
                    <label for="clienteEndereco">Endereço:</label>
                    <input type="text" id="clienteEndereco" v-model="novoCliente.endereco" required>
                </div>
                <button type="submit">Cadastrar Cliente</button>
            </form>
            <br>
            <hr>
            <br>
            <h2>Lista de Clientes</h2>
            <div class="form-group">
                <label for="filterClienteNome">Filtrar por Nome:</label>
                <input type="text" id="filterClienteNome" v-model="filters.nome" placeholder="Digite o nome" @input="loadClientes">
            </div>
            <div class="form-group">
                <label for="filterClienteCpfCnpj">Filtrar por CPF/CNPJ:</label>
                <input type="text" id="filterClienteCpfCnpj" v-model="filters.cpfCnpj" placeholder="Digite o CPF/CNPJ" @input="loadClientes">
            </div>
            <br>
            
            <table id="clientesTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF/CNPJ</th>
                        <th>E-mail</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="5">Carregando clientes...</td>
                    </tr>
                    <tr v-else-if="clientes.length === 0">
                        <td colspan="5">Nenhum cliente encontrado.</td>
                    </tr>
                    <tr v-for="cliente in clientes" :key="cliente.id">
                        <td>{{ cliente.id }}</td>
                        <td>{{ cliente.nome }}</td>
                        <td>{{ cliente.cpfCnpj }}</td>
                        <td>{{ cliente.email }}</td>
                        <td>{{ cliente.endereco }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            novoCliente: {
                nome: '',
                cpfCnpj: '',
                email: '',
                endereco: ''
            },
            clientes: [],
            loading: true,
            filters: {
                nome: '',
                cpfCnpj: ''
            }
        };
    },
    methods: {
        async cadastrarCliente() {
            if (!this.novoCliente.nome || !this.novoCliente.cpfCnpj || !this.novoCliente.email || !this.novoCliente.endereco) {
                showMessage('Todos os campos são obrigatórios!', 'error');
                return;
            }
            if (!isValidCpfCnpj(this.novoCliente.cpfCnpj)) {
                showMessage('CPF/CNPJ inválido!', 'error');
                return;
            }
            if (!isValidEmail(this.novoCliente.email)) {
                showMessage('E-mail inválido!', 'error');
                return;
            }

            const result = await postData('/clientes', this.novoCliente);
            if (result) {
                showMessage('Cliente cadastrado com sucesso!', 'success');
                this.novoCliente = { nome: '', cpfCnpj: '', email: '', endereco: '' };
                await this.loadClientes();
            }
        },
        async loadClientes() {
            this.loading = true;
            let endpoint = '/clientes';
            const params = new URLSearchParams();

            if (this.filters.nome) {

                params.append('nome_like', this.filters.nome);
            }
            if (this.filters.cpfCnpj) {
                params.append('cpfCnpj_like', this.filters.cpfCnpj);
            }

            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const clientesData = await fetchData(endpoint);
            this.clientes = clientesData || [];
            this.loading = false;
        }
    },

    mounted() {
        this.loadClientes();
    }
};


new Vue({
    el: '#admin-app',
    components: {

        clientes: ClientesComponent,
    },
    data: {
        currentModule: 'clientes'
    },
    computed: {

        currentModuleComponent() {

            return this.currentModule;
        }
    },
    methods: {
        selectModule(moduleName) {
            this.currentModule = moduleName;
            console.log('Módulo selecionado:', moduleName);
        }
    },
    mounted() {

        console.log("Aplicação admin Vue montada.");
    }
});