 const numeros = [
      { num: '+524385654768' },
      { num: '+524385654784' },
      { num: '+528184713166' }
    ];

    const lista = document.getElementById('listaNumeros');
    const smsBox = document.getElementById('smsBox');
    let intervaloID = null;

    numeros.forEach(({ num, tiempo }) => {
      const div = document.createElement('div');
      div.className = 'number-card';
      div.innerHTML = `
        <img src="https://flagcdn.com/w40/mx.png" alt="México">
        <strong>${num}</strong>
        <small>${tiempo}</small>
      `;
      div.addEventListener('click', () => {
        smsBox.classList.add('active');
        iniciarAutoActualizacion(num);
      });
      lista.appendChild(div);
    });

    function iniciarAutoActualizacion(numero) {
      const smsContent = document.getElementById('smsContent');
      smsContent.innerHTML = '<p>📡 Cargando mensajes...</p>';
      obtenerMensajes(numero);

      if (intervaloID) clearInterval(intervaloID);
      intervaloID = setInterval(() => obtenerMensajes(numero), 10000);
    }

    function obtenerMensajes(numero) {
      const smsContent = document.getElementById('smsContent');
      smsContent.innerHTML = '<p>📡 Cargando mensajes...</p>';

      const cleanNumber = numero.replace('+', '');
      const url = `https://gvg3y3xp63.execute-api.eu-west-1.amazonaws.com/dev/getsms/${cleanNumber}?x=14710.78&ios=5337-apple-icon-434845&android=gradle.build.83794.android.v34845&delay=15048`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data || !data.payload || data.payload.length === 0) {
            smsContent.innerHTML = '<p>❌ No hay mensajes para este número.</p>';
            return;
          }

          smsContent.innerHTML = '';
          data.payload.forEach(msg => {
            const fechaTraducida = traducirTiempo(msg[0]);
            const remitente = msg[1].replace("From:", "De:");
            const div = document.createElement('div');
            div.className = 'sms';
            div.innerHTML = `
              <strong>Fecha:</strong> ${fechaTraducida}<br>
              <strong>${remitente}</strong><br>
              ${msg[2]}
            `;
            smsContent.appendChild(div);
          });
        })
        .catch(err => {
          console.error('❌ Error al obtener mensajes:', err);
          smsContent.innerHTML = '<p>⚠️ Error al cargar los mensajes.</p>';
        });
    }

    function traducirTiempo(texto) {
      return texto
        .replace("ago", "hace")
        .replace("second", "segundo").replace("seconds", "segundos")
        .replace("minute", "minuto").replace("minutes", "minutos")
        .replace("hour", "hora").replace("hours", "horas")
        .replace("day", "día").replace("days", "días")
        .replace("month", "mes").replace("months", "meses")
        .replace("year", "año").replace("years", "años");
    }
