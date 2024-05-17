const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Iniciar el navegador
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navegar a LinkedIn y realizar el login
  await page.goto('https://www.linkedin.com/login');
  await page.fill('input[name="session_key"]', 'gmail');
  await page.fill('input[name="session_password"]', 'password');
  await page.click('button[type="submit"]');

  // Esperar a que la página de inicio cargue completamente
  await page.waitForSelector('tu_selector_para_confirmar_carga');

  // Navegar a la sección de empleos/aplicaciones (Ajusta la URL según sea necesario)
  await page.goto('https://www.linkedin.com/mynetwork/');

  // Esperar y seleccionar los perfiles de los usuarios que aplicaron
  await page.waitForSelector('selector_para_usuarios_que_aplicaron');
  const users = await page.$$eval('selector_para_usuarios_que_aplicaron', nodes => 
    nodes.map(n => ({
      nombre: n.querySelector('selector_nombre').innerText,
      perfil: n.querySelector('selector_enlace_perfil').href,
      detalle: n.querySelector('selector_detalle_adicional').innerText,
    }))
  );

  // Escribir los datos en un archivo JSON
  fs.writeFile('usuarios_postulados.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      console.error('Error al escribir el archivo', err);
    } else {
      console.log('Archivo guardado con éxito');
    }
  });

  // Cerrar el navegador
  await browser.close();
})();
