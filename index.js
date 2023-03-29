const fs = require('fs');
const axios = require('axios');
const prompt = require('prompt-sync')();

const API_URL = 'http://localhost:3000/tarefas';

function menu() {
  console.log('*** Gerenciador de Tarefas ***');
  console.log('1 - Cadastrar nova tarefa');
  console.log('2 - Alterar uma tarefa');
  console.log('3 - Marcar tarefa como concluída');
  console.log('4 - Excluir uma tarefa');
  console.log('5 - Listar tarefas pendentes');
  console.log('6 - Listar tarefas concluídas');
  console.log('0 - Sair do sistema');
  return prompt('Opção: ');
}

async function createTask() {
  let tarefas = []

  const id = prompt('ID: ');
  const descricao = prompt('Descrição: ');
  const status = 'Pendente';
  const task = { id, descricao, status };
  tarefas.push(task)

  const response = await axios.post(API_URL, task);
  console.log('Tarefa cadastrada com sucesso!');
  console.log(tarefas);
}

async function updateTask() {
  const id = prompt('ID da tarefa a ser alterada: ');
  const descricao = prompt('Nova descrição: ');
  const response = await axios.patch(`${API_URL}/${id}`, { descricao });
  console.log('Tarefa alterada com sucesso!');
  console.log(response.data);
}

async function completeTask() {
  const id = prompt('ID da tarefa concluída: ');
  const response = await axios.patch(`${API_URL}/${id}`, { status: 'Concluída' });
  console.log('Tarefa concluída com sucesso!');
  console.log(response.data);
}

async function deleteTask() {
  const id = prompt('ID da tarefa a ser excluída: ');
  const response = await axios.delete(`${API_URL}/${id}`);
  console.log('Tarefa excluída com sucesso!');
  console.log(response.data);
}

async function listPendingTasks() {
  try {
    const response = await axios.get(API_URL);
    const tarefas = response.data;
    const tarefasPendentes = tarefas.filter(tarefa => tarefa.status === 'Pendente');
    console.log('Tarefas pendentes:');
    console.table(tarefasPendentes);
  } catch (error) {
    console.error(error);
  }
}

async function listCompletedTasks() {
  const response = await axios.get(`${API_URL}?status = Concluída`);
  console.log('Tarefas concluídas:');

  if (Array.isArray(response.data)) {
    const tarefas = response.data.filter((tarefa) => tarefa.status === 'Concluída');
    console.table(tarefas); // exibe a lista em uma tabela no console
  } else {
    console.log('Erro: a resposta da API não é uma lista!');
  }
}

async function main() {
  try {
    let opcao;
    do {
      opcao = menu();
      switch (opcao) {
        case '1':
          await createTask();
          break;
        case '2':
          await updateTask();
          break;
        case '3':
          await completeTask();
          break;
        case '4':
          await deleteTask();
          break;
        case '5':
          await listPendingTasks();
          break;
        case '6':
          await listCompletedTasks();
          break;
        case '0':
          console.log('Até mais!');
          break;
        default:
          console.log('Opção inválida!');
      }
    } while (opcao !== '0');
  } catch (error) {
    console.error(error);
  }
}

main();
