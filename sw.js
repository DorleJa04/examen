const Static = 'Estatico';
const Inmutable = 'Inmutable';
const Dinamic = 'Dinamico';

function limpiar_cache(CacheName, NumeroElementos) {
	caches.open(CacheName).then(cache=>{
		return cache.keys().then(keys=>{
			if (keys.legth>NumeroElementos){
				cache.delete(keys[0]).then(limpiar_cache(CacheName,NumeroElementos))
			}
		})
	})
}

//Crear evento de instalacion agregar archivos necesarios al cache

self.addEventListener('install',event=>{
	const varcacheStatic = caches.open(Static).then(cache=>{
		return cache.addAll([
		'/',
		'/index.html',
        '/1.html',
		'/2.html',
		'/3.html',
		'/img/1.png',
        '/img/2.png',
		'/img/3.png',
		'/img/4.png',

		'manifest.json',

		'js/jquery.min.js',
		'sw.js'
	
	]);
});

	const varcacheInmut = caches.open(Inmutable).then(cache=>{
		return cache.addAll([
            '/pages/off3.html',
            '/imagen/web.png'
		]);
	});

	event.waitUntil(Promise.all([varcacheStatic,varcacheInmut]));
});
self.addEventListener('activate',event=>{
	caches.keys().then((keys)=>{
		keys.forEach((cache)=>{
			if (cache.includes("Estatico") && !cache.includes(Static)){
				caches.delete(cache);
			}
		});
	});
});

self.addEventListener('fetch', event=>{
	const respuesta = fetch(event.request)
	.then((res)=>{
		if(res){
			caches.match(event.request).then((cache)=>{
				if(!cache){
					caches.open(Dinamic).then((cache)=>{
						cache.add(event.request.url);
					});	
				}
			});
			return res;
		}else{
			return caches.match(event.request.url).then((newRes)=>{
				if(newRes){
					return newRes;
				}else{
			if (/\.(png|jpg)$/.test(event.request.url)){
				return caches.match("imagen/web.png"); 
		}
		return caches.match("imagen/web.png"); 
	       }  
       });
    }
})
.catch ((error)=>{
	return caches.match(event.request.url).then((newRes)=>{
		if (newRes){
			return newRes;
		}else{
			if (/\.(png|jpg)$/.test(event.request.url)){
				return caches.match("/imagen/web.png"); 
		}
		return caches.match("/imagen/web.png"); 
		}
	});
});
event.respondWith(respuesta);

});