class Publisher {
	// Key es el nombre del evento, valores es un array de funciones
	eventos = new Map();
	constructor() { };

	publicar(evento, valores) {
		const suscriptores = this.eventos.get(evento);
		suscriptores.forEach(sub => {
			sub(valores);
		});
	};

	suscribir(evento, func) {
		if (!this.eventos.has(evento)) {
			this.eventos.set(evento, [func]);
		} else {
			let sub = this.eventos.get(evento);
			sub.push(func);
			this.eventos.set(evento, sub);
		}
	};

	desvincular(evento, func) {
		if (!this.eventos.has(evento)) {
			return;
		}
		let sub = this.eventos.get(evento);
		sub.splice(sub.indexOf(func), 1);
		this.eventos.set(evento, sub);
	};
}

function suscriptor1(mensaje) {
	console.log("subscriptor1: " + mensaje);
}

function suscriptor2(mensaje) {
	console.log("subscriptor2: " + mensaje);
}

const publisher = new Publisher();

publisher.suscribir("mensaje", suscriptor1)
publisher.suscribir("mensaje", suscriptor2)
publisher.publicar("mensaje", "mi primer mensaje");
publisher.desvincular("mensaje", suscriptor1);
publisher.publicar("mensaje", "mi segundo mensaje");