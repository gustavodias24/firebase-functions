const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp();

exports.printNotificacoes = functions.database.ref('/indicacoes/{pushId}')
.onWrite((change, context) => {
  
  const document = change.after.val();
  const nomeCliente = document.nomeCompleto;

  
  const usersRef = admin.database().ref('/usuarios');

  return usersRef.once('value').then(snapshot => {

    // Iterando sobre os nós de usuário e registrando o nome de cada usuário no log
    snapshot.forEach(childSnapshot => {

      const user = childSnapshot.val();

      var menssage = {
        data: {
          title: "Nova Indicação",
          body:  nomeCliente + " Foi Indicado."
        },
        token: user.token
      }

      if ( user.tipo > 0){
        admin.messaging().send(menssage).then((response) => {
          console.log('Sucesso! msg enviada!', response);
        }).catch((error) =>{
          console.log('Error! msg enviada!', error);
        });
      }
  
    });

    return null; // Retornando nulo para indicar que a função foi concluída com sucesso
  }).catch(error => {
    console.error("Erro ao recuperar dados de usuários:", error);
    throw error; // Lançando o erro para ser tratado
  }); 

});
