interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => 
    document.querySelector(query);

    function calcTempo(mil: number) {
      const min = Math.floor(mil / 60000);
      const sec = Math.floor((mil % 60000) / 1000);

      return `${min}m e ${sec}s`;
    }

    function patio() {

      function ler() : Veiculo[] {
        return localStorage.patio ? JSON.parse(localStorage.patio) : []; //localStorage trabalha com string
      }

      function salvar (veiculos: Veiculo[]) {  //toda vez que adicionar um veiculo vai salvar
        localStorage.setItem("patio", JSON.stringify(veiculos));
      }

      function adicionar(veiculo: Veiculo, salva?: boolean) {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class="delete" data-placa="${veiculo.placa}">X</button>
        </td>
        `;

        row.querySelector(".delete")?.addEventListener("click", function (){ //arrow function não permite chamar o this
          remover(this.dataset.placa); //removido o "strict": true do tsconfig.json para não dar erro aqui
        });

        $("#patio")?.appendChild(row); //adiciona os dados na row

        if (salva) salvar([...ler(), veiculo]) //spread
      }

      function remover(placa: string) {
        const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
        const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime()); // o typescript não permite fazer conta com o newDate() por isso o .getTime que pega o tempo em milissegundos foi adicionado
        if (
          !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
        ) 
          return;

        salvar(ler().filter((veiculo) =>veiculo.placa !== placa));
        render();
      }

      function render() {
        $("#patio")!.innerHTML = ""; //usar o force só quando ter certeza, para não quebrar o código
        const patio = ler();

        if (patio.length) {
          patio.forEach((veiculo) => adicionar(veiculo));
        }
      }

      return { ler, adicionar, remover, salvar, render };
    }


  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Os campos nome e placa são obrigatórios");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true); // .toISOString() transforma para o padrão mundial de horário

  });
})();
