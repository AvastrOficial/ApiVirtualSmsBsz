(function(global) {
  let numeros = [
    { num: '+524385654768', tiempo: 'hace 2 meses' },
    { num: '+524385654784', tiempo: 'hace 2 meses' },
    { num: '+528184713166', tiempo: 'hace 2 horsas' },
    { num: '+524385654586', tiempo: 'hace 2 meses' },
    { num: '+528124139063', tiempo: 'hace 5 meses' },
    { num: '+528135638649', tiempo: 'hace 2 horas' },
    { num: '+528184760979', tiempo: 'hace 21 horas' },
    { num: '+528886732311', tiempo: 'hace 2 horas' },
    { num: '+527228657766', tiempo: 'hace 3 meses' },
    { num: '+528126275598', tiempo: 'hace 4 meses' }
  ];

  let intervaloID = null;

  function traducirTiempo(texto) {
    return texto
      .replace(/ago/gi, "hace")
      .replace(/second(s?)/gi, "segundo$1")
      .replace(/minute(s?)/gi, "minuto$1")
      .replace(/hour(s?)/gi, "hora$1")
      .replace(/day(s?)/gi, "día$1")
      .replace(/month(s?)/gi, "mes$1")
      .replace(/year(s?)/gi, "año$1");
  }

  function obtenerMensajes(numero, smsContent) {
    smsContent.innerHTML = '<p>📩 Cargando mensajes...</p>';

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
          div.style.marginBottom = '10px';
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

  function iniciarAutoActualizacion(numero, smsContent) {
    obtenerMensajes(numero, smsContent);

    if (intervaloID) clearInterval(intervaloID);
    intervaloID = setInterval(() => obtenerMensajes(numero, smsContent), 10000);
  }

  function crearUI() {
    if (document.getElementById('smsApiContainer')) {
      document.getElementById('smsApiContainer').remove();
    }

    const container = document.createElement('div');
    container.id = 'smsApiContainer';
    container.style.maxWidth = '400px';
    container.style.margin = '10px auto';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.color = '#333';

    container.innerHTML = `
      <style>
        #smsApiContainer .number-card {
          cursor: pointer;
          border: 1px solid #ddd;
          padding: 8px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 5px;
          transition: background-color 0.2s ease;
        }
        #smsApiContainer .number-card:hover {
          background-color: #f0f0f0;
        }
        #smsApiContainer #smsBox {
          border: 1px solid #ccc;
          padding: 10px;
          max-height: 400px;
          overflow-y: auto;
          margin-top: 15px;
          border-radius: 5px;
          display: none;
        }
        #smsApiContainer .sms {
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
      </style>
      <div id="listaNumeros"></div>
      <div id="smsBox">
        <h3>Mensajes SMS</h3>
        <div id="smsContent"></div>
      </div>
      <div style="text-align:center; margin-top:10px; font-size:12px; color:#999;">
        Hecho por <strong>AvaStrOficial</strong>
      </div>
    `;

    document.body.appendChild(container);

    const lista = container.querySelector('#listaNumeros');
    const smsBox = container.querySelector('#smsBox');
    const smsContent = container.querySelector('#smsContent');

    numeros.forEach(({ num, tiempo }) => {
      const div = document.createElement('div');
      div.className = 'number-card';
      div.innerHTML = `
        <img src="https://flagcdn.com/w40/mx.png" alt="México" style="width:24px; height:16px;">
        <strong>${num}</strong>
        <small style="color:#555;">${tiempo}</small>
      `;

      div.addEventListener('click', () => {
        smsBox.style.display = 'block';
        iniciarAutoActualizacion(num, smsContent);
      });

      lista.appendChild(div);
    });
  }

  function autoInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', crearUI);
    } else {
      crearUI();
    }
  }

  autoInit();

  global.smsApi = {
    setNumeros: (n) => { numeros = n; },
    reload: () => crearUI()
  };

})(window);
