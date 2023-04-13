import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { Router } from '@angular/router';



import { Mentor } from '../models/Mentor'
import { servico } from './Servico';
import {  AssociadoCras, IndividuoNetgas, ArtefatoCras, PostoSaude } from './Modelo';


export class Controlador {

	static postoAtual : PostoSaude;
	static doseVacina = 0;
	static listaPosto;
	static laboratorio = -1;
	static vencido = 0;
	static criterio = 0;
	static faltamdias = 0;


	static achaArtefato(lista: ArtefatoCras[],  ind : IndividuoNetgas){
		var tipo: number = servico.tipoDocumento;

		if(lista != null)
			for(var x: number = 0;x<lista.length;x++){
				if(lista[x].tipoDocumento == 0)
					lista[x].tipoDocumento = 1;
				if(lista[x].tipoDocumento == tipo){
					lista[x].flagApp = 1;
					lista[x].individuo = new IndividuoNetgas(null);
					lista[x].individuo.codigo = ind.codigo;
					if(ind.associadoCras != undefined && ind.associadoCras != null){
						lista[x].domicilioCras = ind.associadoCras.domicilioCras;
					}
					
					return lista[x];
				}
			}
				
					
		var retorno : ArtefatoCras = new ArtefatoCras(null);
		lista.push(retorno);

		retorno.individuo = new IndividuoNetgas(null);
		retorno.flagApp=1;
		retorno.individuo.codigo = ind.codigo;
		if(ind.associadoCras != undefined && ind.associadoCras != null){
		retorno.domicilioCras = ind.associadoCras.domicilioCras;
		}
		retorno.extensao = ".png"
		retorno.tipoDocumento = tipo;
		retorno.flagUpload = 1;
		retorno.descricao = retorno.tipoDocumentoFormatado + " de " + ind.nome;

		return retorno;
	}


	public formataData(dt: Date) {
		var retorno = "";
		retorno = dt.getDate() + "";
		if (dt.getDate() < 10)
			retorno = "0" + retorno;
		retorno = retorno + "/";
		var mes = dt.getMonth() + 1;
		if (mes < 10)
			retorno = retorno + "0";
		retorno = retorno + mes + "/" + dt.getFullYear();

		return retorno;

	}



	static codigoIgual(a, b) {

		try {
			if (a.codigo == b.codigo)
				return true;
			else
				return false;
		} catch (e) {
			return false;
		}

	}

	static salvaRaizVisita(store: Storage, loc: Location) {
		var raiz = servico.contexto["raiz"];
		store.get("listaRaiz").then(raizes => {
			raizes[raiz.ionicIndiceRepositorio] = raiz;
			store.set("listaRaiz", raizes);
			if (loc != null)
				loc.back();
		});
	}


	// public visitaBaixada(lVisitas: AcompanhamentoDomCras[], sVisita: AcompanhamentoDomCras) {
	// 	if (lVisitas != null)
	// 		for (let x: number = 0; x < lVisitas.length; x++)
	// 			if (lVisitas[x].codigo == sVisita.codigo)
	// 				return true;
	// 	return false;
	// }




}