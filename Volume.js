class Volume {
    constructor(defaut) {
        this.leVolume = defaut;
    }

    getVolume() {
        return (this.roundDecimal(this.leVolume, 2) * 100).toString() + '%';
    }

    setVolume(leVolume) {
        this.leVolume = leVolume;
        return this.leVolume.toString()
    }

    up() {
        this.leVolume += 0.1
        if (this.leVolume >= 1)
            this.leVolume = 1
        return this.leVolume.toString()
    }

    down() {
        this.leVolume -= 0.1
        if (this.leVolume <= 0)
            this.leVolume = 0
        return this.leVolume.toString()
    }

    roundDecimal(nombre, precision){
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round( nombre*tmp )/tmp;
    }

}
module.exports = Volume