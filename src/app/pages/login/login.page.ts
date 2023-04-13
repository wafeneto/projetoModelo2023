import { GlobalComponent } from './../../global/global.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Mentor } from '../../models/Mentor';
import { licencaMunicipioSistema } from '../../models/Modelo'
import { servico } from '../../models/Servico'



import { LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {



  cpf: String = "000.000.000-00"
  nascimento: String = "00/00/0000"

  load: any = null;

  global: any;
  municipio: licencaMunicipioSistema = null;

  logo : String = "/assets/images/examples/carregamento.png";

  constructor(
    private router: Router,
    public globalComponent: GlobalComponent,
    private storage: Storage,

		private loadingCtrl: LoadingController,
    private alertController: AlertController,


  ) {
    this.global = this.globalComponent;
    loadingCtrl.create({
      message: "Conectando Servidor."
    }).then((l=> {this.load = l}))

    }
  

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Importante',
      message: "Para acessar o aplicativo, é preciso estar inscrito no Cadastro Único Federal Procure uma Unidade de Assistência Social (CRAS) ou a Central do Cadastro Único mais próxima.",
      buttons: ['OK']
    });

    

    await alert.present();
  }

  //alerta para informar o CPF
  async alertaCpf() {
    const alert = await this.alertController.create({
      header: 'Importante',
      message: "Por favor, preencha seu CPF corretamente .",
      buttons: ['OK']
    });

    await alert.present();
  }

  //alerta para informar a senha
  async alertaSenha() {
    const alert = await this.alertController.create({
      header: 'Importante',
      message: "Por favor, preencha sua data de nascimento.",
      buttons: ['OK']
    });

    await alert.present();
  }
  // form login

  loginForm() {
  //  console.log('Data Requerida: ', e.value);

    if (this.cpf == '' || this.cpf == undefined) {
      //this.globalComponent.loadToast('Por favor, preencha seu e-mail corretamente');
      return this.alertaCpf();
    } else if (this.nascimento == '' || this.nascimento == undefined) {
      //this.globalComponent.loadToast('Por favor, preencha sua data de nascimento');
      return this.alertaSenha();
    } else {


      this.load.present();
      setTimeout(() => {
        this.loginForm2();
      }, 100);

      return;

      // tentar fazer login

      var usuario = Mentor.executaVisao(3063, "varcpf=" + this.cpf + "&vardataNascimento=" + this.nascimento);

      this.load.dismiss();
      if (usuario == null) {
        alert("nenhum usuario encontrado")
        return;
      } 


      servico.imagem

      if(usuario.associadoCras != null && usuario.associadoCras.domicilioCras!= null && usuario.associadoCras.domicilioCras.historicoUnidades != null){
        for(var x = 0;x<usuario.associadoCras.domicilioCras.historicoUnidades.length;x++)
          if(usuario.associadoCras.domicilioCras.historicoUnidades[x].dataFimFormatado=="" && usuario.associadoCras.domicilioCras.historicoUnidades[x].unidade != null)
            servico.cras = usuario.associadoCras.domicilioCras.historicoUnidades[x].unidade;
      }

      this.storage.set("ultimoUsuario",usuario);
      servico.usuarioLogado = usuario;

      if(usuario.dataUltimoAcessoAppFormatado == null){
        usuario.dataUltimoAcessoApp = new Date();
        usuario.dataUltimoAcessoAppFormatado = Mentor.dateToString(new Date());
      }

      //var mensagens = Mentor.executaVisao(3071, "");

      var parametro = "individuo="+servico.usuarioLogado.codigo;

      if(servico.cras != null)    
        parametro = parametro + "&unidade=" + servico.cras.codigo;
      
  
      var palavra = Mentor.bind(parametro,"/jsp/appCidadao/listaMensagens.jsp","POST");
      var mensagens = eval(palavra + "");

      if(mensagens != null){
        for(var x = 0;x<mensagens.length;x++){
          if(Mentor.stringToDate(mensagens[x].publicacaoFormatado).getTime() > Mentor.stringToDate(usuario.dataUltimoAcessoAppFormatado).getTime())
            servico.temMensagemNova = true;
        }
      }


      servico.dataUltimoAcessoApp = Mentor.stringToDate(usuario.dataUltimoAcessoAppFormatado);
      usuario.dataUltimoAcessoApp = new Date();
      
      Mentor.rodaTransacaoFromObjeto(1788,"obj", usuario,false);



      let url = '/tabs/meus-dados';
      //let url_withparameter = '/tabs/meus-dados?cpf=' + e.value.login_cpf + '&nascimento=' + e.value.login_nascimento;

      this.storage.set('cpf',this.cpf);
      

      this.router.navigateByUrl(url);
    }
  }


  loginForm2() {
    //  console.log('Data Requerida: ', e.value);
  
     {
  
  
        this.load.present();
  
        // tentar fazer login
  
        var usuario = Mentor.executaVisao(3063, "varcpf=" + this.cpf + "&vardataNascimento=" + this.nascimento);
  
        if (usuario == null) {

        this.load.dismiss();
          alert("nenhum usuario encontrado")
          return;
        } 
  
  
        servico.imagem
  
        if(usuario.associadoCras != null && usuario.associadoCras.domicilioCras!= null && usuario.associadoCras.domicilioCras.historicoUnidades != null){
          for(var x = 0;x<usuario.associadoCras.domicilioCras.historicoUnidades.length;x++)
            if(usuario.associadoCras.domicilioCras.historicoUnidades[x].dataFimFormatado=="" && usuario.associadoCras.domicilioCras.historicoUnidades[x].unidade != null)
              servico.cras = usuario.associadoCras.domicilioCras.historicoUnidades[x].unidade;
        }
  
        this.storage.set("ultimoUsuario",usuario);
        servico.usuarioLogado = usuario;
  
        if(usuario.dataUltimoAcessoAppFormatado == null){
          usuario.dataUltimoAcessoApp = new Date();
          usuario.dataUltimoAcessoAppFormatado = Mentor.dateToString(new Date());
        }
  
        //var mensagens = Mentor.executaVisao(3071, "");
  
        var parametro = "individuo="+servico.usuarioLogado.codigo;
  
        if(servico.cras != null)    
          parametro = parametro + "&unidade=" + servico.cras.codigo;
        
    
        var palavra = Mentor.bind(parametro,"/jsp/appCidadao/listaMensagens.jsp","POST");
        var mensagens = eval(palavra + "");
  
        if(mensagens != null){
          for(var x = 0;x<mensagens.length;x++){
            if(Mentor.stringToDate(mensagens[x].publicacaoFormatado).getTime() > Mentor.stringToDate(usuario.dataUltimoAcessoAppFormatado).getTime())
              servico.temMensagemNova = true;
          }
        }
  
  
        servico.dataUltimoAcessoApp = Mentor.stringToDate(usuario.dataUltimoAcessoAppFormatado);
        usuario.dataUltimoAcessoApp = new Date();
        
        Mentor.rodaTransacaoFromObjeto(1788,"obj", usuario,false);
  
  
  
        let url = '/tabs/meus-dados';
        //let url_withparameter = '/tabs/meus-dados?cpf=' + e.value.login_cpf + '&nascimento=' + e.value.login_nascimento;
  
        this.storage.set('cpf',this.cpf);
        
  

        this.load.dismiss();
        
        this.router.navigateByUrl(url);
      }
    }



  async ionViewDidEnter(){
    await this.storage.create();
    var licenca: licencaMunicipioSistema = await this.storage.get('licenca');
    //alert(licenca);
    if (licenca == null) {
      this.router.navigateByUrl('selecao-municipio');
    }
    else{
      Mentor.UrlRequest = "https://app.conectasuas.com.br/assistenciaSocial/"
      //"http://app.vvision.com.br:8080/assistenciaSocial/";
      var licencas = Mentor.executaVisao(2632,"varcodigo=" + licenca.estado.codigo + "&varsistema=" + licenca.sistema + "&varnomeMunicipio=" + licenca.nomeMunicipio);
      if(licencas == null || licencas.length != 1)
      this.router.navigateByUrl('selecao-municipio');
      else{
        licenca = licencas[0];
        this.storage.set("licenca", licenca);
      }

    }

    Mentor.UrlRequest = licenca.urlServidor;
    this.logo = licenca.logo;

    this.storage.get("ultimoUsuario").then(usu => {
      if(usu == null)
        return this.presentAlert();

  });
  }


  async navegacao() {
    await this.storage.create();
    await this.storage.remove("licenca");
    this.router.navigate(["selecao-municipio"]);

  }


  //cpf() {
  //  this.router.navigate(['/tabs/meus-dados']);
  // }

}
