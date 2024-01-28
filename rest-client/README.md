## VSCode REST Client
* <https://marketplace.visualstudio.com/items?itemName=humao.rest-client>

### USUÁRIO GESTOR -> CRIA USER (COMUM, AFILIADO)
POST http://localhost:3000/user
Header authorization JWT GESTOR
name, email, password, role (comum, afiliado)

### USUÁRIO GESTOR -> CRIA KART
POST http://localhost:3000/kart
Header authorization JWT GESTOR
status      KartStatus
name        String
marca       String
modelo      String
potencia    Int
marca_pneus String

### USUÁRIO GESTOR -> CRIA PISTA
POST http://localhost:3000/pista
Header authorization JWT GESTOR
name               String
km                 Int
quantidade_boxes   Int
quantidade_lugares Int
endereco           String

### USUÁRIO AFILIADO -> CRIA AGENDAMENTO
POST http://localhost:3333/agendamento
Header authorization JWT AFILIADO
user_id
kart_id
kart_status (FREE?)
pista_id
period_start
period_end

### TODOS OS USUÁRIOS -> ACESSAM HISTÓRICO DAS CORRIDAS
GET http://localhost:3000/historico-corridas
Header authorization JWT do usuário
retorna {
	success: true,
	data: [
		{
			corrida1 dados
		},
		{
			corrida2 dados
		}
	]
}

### EVENTO -> CREATE CORRIDAS
POST http://localhost:3000/event/corrida
Header authorization JWT GESTOR
body: {
	user_id
	kart_id
	pista_id
	corrida_start
	had_an_agendamento_during_this_period
}

### EVENTO -> UPDATE CORRIDAS
PATCH http://localhost:3000/event/corrida/{corrida_id}/update
Header authorization JWT GESTOR
body: {
	corrida_end
	Caso a corrida não possua horário de fim informado, o sistema deve interpretar que houve um acidente e a corrida foi abortada.
}

### EVENTO -> ENVIA/RETIRA KART MANUTENÇÃO
POST http://localhost:3000/event/kart/send-manutencao
Header authorization JWT GESTOR
body: {
	kart_id
	motivo
	manutencao_start
	manutencao_end
}

### EVENTO -> ENVIA/RETIRA KART MANUTENÇÃO
POST http://localhost:3000/event/kart/send-manutencao
Header authorization JWT GESTOR
body: {
	kart_id
	motivo
	manutencao_start
	manutencao_end
}

### EVENTO -> CRIA ACIDENTE
POST http://localhost:3000/event/acidente
Header authorization JWT GESTOR
body: {
	envolvidos: [users_ids aqui]
	pista_id
	horario_do_acidente
}

### NOTIFICAÇÃO
// CRIAR PATTERN DE OBSERVER AQUI, CASO CORRIDA É INICIADA OU ACIDENTE ACONTECE
