## VSCode REST Client
* <https://marketplace.visualstudio.com/items?itemName=humao.rest-client>

### USUÁRIO MANAGER -> CRIA USER (COMMON, AFFILIATE)
POST http://localhost:3000/user
Header authorization JWT MANAGER
name, email, password, role (comum, afiliado)

### USUÁRIO MANAGER -> CRIA KART
POST http://localhost:3000/kart
Header authorization JWT MANAGER
status      KartStatus
name        String
brand       String
model      String
power    Int
tire_brand String

### USUÁRIO MANAGER -> CRIA PISTA
POST http://localhost:3000/road
Header authorization JWT MANAGER
name               String
km                 Int
quantity_boxes   Int
quantity_places Int
address           String

### USUÁRIO AFFILIATE -> CRIA AGENDAMENTO
POST http://localhost:3333/schedule
Header authorization JWT AFFILIATE
user_id
kart_id
kart_status (FREE?)
road_id
period_start
period_end

### TODOS OS USUÁRIOS -> ACESSAM HISTÓRICO DAS CORRIDAS
GET http://localhost:3000/history-races
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
Header authorization JWT MANAGER
body: {
	user_id
	kart_id
	road_id
	corrida_start
	had_an_schedule_during_this_period
}

### EVENTO -> UPDATE CORRIDAS
PATCH http://localhost:3000/event/corrida/{corrida_id}/update
Header authorization JWT MANAGER
body: {
	corrida_end
	Caso a corrida não possua horário de fim informado, o sistema deve interpretar que houve um acidente e a corrida foi abortada.
}

### EVENTO -> ENVIA/RETIRA KART MANUTENÇÃO
POST http://localhost:3000/event/kart/send-maintenance
Header authorization JWT MANAGER
body: {
	kart_id
	reason
	manutencao_start
	manutencao_end
}

### EVENTO -> ENVIA/RETIRA KART MANUTENÇÃO
POST http://localhost:3000/event/kart/send-maintenance
Header authorization JWT MANAGER
body: {
	kart_id
	reason
	manutencao_start
	manutencao_end
}

### EVENTO -> CRIA ACIDENTE
POST http://localhost:3000/event/acidente
Header authorization JWT MANAGER
body: {
	involved: [users_ids aqui]
	road_id
	horario_do_acidente
}

### NOTIFICAÇÃO
// CRIAR PATTERN DE OBSERVER AQUI, CASO CORRIDA É INICIADA OU ACIDENTE ACONTECE
