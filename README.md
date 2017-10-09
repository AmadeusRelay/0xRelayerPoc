# 0xRelayer

Deve-se configurar o geth na máquina local:

### Ambiente Mac

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


### Ambiente Linux

Instalar o curl (necessário para instalar o nvm):

```
sudo apt-get update
sudo apt-get install curl
```

Instalar o nvm (necessário para instalar o node):

```
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
```

Instalar o node:

```
nvm install node
```

Instalar o client do [ethereum](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum):

```
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```
##

Nesse ponto, estará com o geth instalado. Daqui em diante, é igual para Mac e Linux. Pode executar ele na testnet através do comando:

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
