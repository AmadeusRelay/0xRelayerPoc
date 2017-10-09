# 0xRelayer

Deve-se configurar o geth na máquina local:

### Ambiente Mac (Linux deve ser igual)

Instalar o brew:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew doctor
```

Adicionar o brew no PATH do `.bashrc`:

```
export PATH="/usr/local/bin:$PATH"
```

Instalar o node:

```
brew install node
```

Instalar o client do [ethereum](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum):

```
brew tap ethereum/ethereum
brew install ethereum
```

Isso já instala o geth. Pode executar ele na testnet através do comando:

```
geth --testnet --mine
```

Vai demorar muito até sincronizar tudo. Mas pra rodar o app pela testnet do 0x não precisa do comando acima.

Clonar o repositório:

```
git clone https://github.com/AmadeusRelayer/0xRelayer.git
```

Instalar as dependências:

```
npm install
```

Para rodar o linter (que verifica se o código tá seguindo as boas práticas):

```
npm run lint
```

Para rodar os testes:

```
npm run test
```

Para executar, deve-se abrir dois terminais e executar os comandos abaixo (um em cada terminal):

```
npm run ethereum
npm run build
````

Hot deploy funciona. Debug no chrome ainda não funciona.