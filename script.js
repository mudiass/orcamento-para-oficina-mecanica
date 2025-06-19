  const tituloToggle = document.getElementById('titulo-toggle');
    const form = document.getElementById('order-form');

    tituloToggle.addEventListener('click', () => {
      const isOpen = form.classList.toggle('open');
      tituloToggle.setAttribute('aria-expanded', isOpen);
    });

    
    tituloToggle.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tituloToggle.click();
      }
    });

    function calcularTotal() {
      const linhas = form.querySelectorAll('#tabela-orcamento tbody tr');
      let totalSemDesconto = 0;
      linhas.forEach((linha) => {
        const preco = parseFloat(linha.querySelector('.preco').value) || 0;
        const qtd = parseInt(linha.querySelector('.quantidade').value) || 0;
        const total = preco * qtd;
        linha.querySelector('.total').textContent = total.toFixed(2);
        totalSemDesconto += total;
      });
      document.getElementById('totalSemDesconto').textContent = totalSemDesconto.toFixed(2);

      const desconto = parseFloat(document.getElementById('desconto').value) || 0;
      const totalComDesconto = totalSemDesconto * (1 - desconto / 100);
      document.getElementById('totalComDesconto').textContent = totalComDesconto.toFixed(2);
    }

    function adicionarProduto() {
      const tbody = form.querySelector('#tabela-orcamento tbody');
      const numProdutos = tbody.children.length + 1;
      const novaLinha = document.createElement('tr');
      novaLinha.innerHTML = `
        <td data-label="Item">${numProdutos}</td>
        <td><input type="text" class="nome-produto" /></td>
        <td><input type="number" class="preco" min="0" step="0.01" onchange="calcularTotal()" /></td>
        <td><input type="number" class="quantidade" min="0" step="1" onchange="calcularTotal()" /></td>
        <td><span class="total">0.00</span></td>
        <td><button type="button" class="btn-black btn-sm" onclick="removerProduto(this)">Excluir</button></td>
      `;
      tbody.appendChild(novaLinha);
    }

    function removerProduto(botao) {
      const linha = botao.closest('tr');
      linha.remove();
      calcularTotal();
      
      const linhas = form.querySelectorAll('#tabela-orcamento tbody tr');
      linhas.forEach((linha, idx) => {
        linha.querySelector('td[data-label="Item"]').textContent = idx + 1;
      });
    }

    function imprimirPDF() {
  const formulario = document.getElementById("order-form");

  html2canvas(formulario).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("ordem_de_servico.pdf");
  });
}
