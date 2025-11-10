# Techdoro

Como buildar o projeto

### 1. Primeiro método

```bash
npm run make
```

Dessa forma você irá gerar os instaladores com base no sistema operacional que você está utilizando.
Porem dependendo do sistema operacional, pode ser que você precise de algumas dependências adicionais.

---
### 2. Segundo método (RPM e DEB)

</br>

*Você só pode compilar o alvo RPM em máquinas Linux com os `rpm` pacotes `rpm-build` instalados.*

No Fedora você pode fazer algo assim:
```bash
sudo dnf install rpm-build
```

No Debian ou Ubuntu, você precisará fazer o seguinte:
```bash
sudo apt-get install rpm
```
</br>

*Você só pode compilar o pacote deb em máquinas Linux com os `fakeroot` pacotes `dpkg` instalados.*

No Debian ou Ubuntu, você pode fazer algo assim:
```bash
sudo apt-get install fakeroot dpkg
```

---

### 2. Terceiro método (Windows)

Você só pode compilar o alvo Squirrel.Windows em uma máquina Windows ou em uma máquina Linux com `mono` o pacote squirrel `wine` instalado.