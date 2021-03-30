import React, { Component } from "react";
import "./zombieChar.css";

class ZombieChar extends Component {

    catMode () {
       return ((parseInt(this.props.DNA) % 100) !== 0);
    }

    currentHeadChoice () {
        let i =  parseInt(this.props.DNA.substring(0, 2)) % 7 + 1;
        return "static/zombieparts/head-" + i + "@2x.png";
    }

    currentEyeChoice ()  {
        let i = parseInt(this.props.DNA.substring(2, 4)) % 11 + 1;
        return "static/zombieparts/eyes-" + i + "@2x.png";
    }

    currentShirtChoice ()  {
        let i = parseInt(this.props.DNA.substring(4, 6)) % 6 + 1;
        return "static/zombieparts/shirt-" + i + "@2x.png";

    }

    render() {
        const skinStyle = {
            filter: "hue-rotate(" + parseInt(this.props.DNA.substring(6, 8)) / 100 * 360 + "deg)",
        };

        const eyeStyle = {
            filter: "hue-rotate(" + parseInt(this.props.DNA.substring(8, 10)) / 100 * 360 + "deg)",
        };

        const shirtStyle = {
            filter: "hue-rotate(" + parseInt(this.props.DNA.substring(10,12)) / 100 * 360 + "deg)",
        };

        if (this.catMode()) {
            return (
                <div className="zombie-preview" v-images-loaded="zombieLoaded">
                    <img  style={skinStyle} className="right-upper-arm" src="static/zombieparts/right-upper-arm-1@2x.png" alt="right upper arm" />
                    <img  style={shirtStyle}className="torso" src="static/zombieparts/torso-1@2x.png" alt="torso" />
                    <img  style={skinStyle}className="cat-legs" src="static/zombieparts/catlegs.png" alt="catleg" />
                    <img  style={shirtStyle} className="shirt" src={this.currentShirtChoice()} alt="shirt" />
                    <img  style={skinStyle} className="left-forearm" src="static/zombieparts/left-forearm-1@2x.png" alt="left forearm" />
                    <img  style={skinStyle} className="right-forearm" src="static/zombieparts/right-forearm-1@2x.png" alt="right forearm" />
                    <img  style={skinStyle} className="left-upper-arm" src="static/zombieparts/left-upper-arm-1@2x.png" alt="left upper arm" />
                    <img  style={skinStyle} className="left-hand" src="static/zombieparts/hand1-1@2x.png" alt="left hand" />
                    <img  style={skinStyle} className="right-hand" src="static/zombieparts/hand-2-1@2x.png" alt="right hand" />
                    <img  style={skinStyle} className="head" src={this.currentHeadChoice()} alt="head" />
                    <img  style={eyeStyle}  className="eye"  src={this.currentEyeChoice()} alt="eyes" />
                    <img  className="mouth" src="static/zombieparts/mouth-1@2x.png" alt="mouth" />
                </div>
            )
        } else {
            return (
                <div className="zombie-preview" v-images-loaded="zombieLoaded">
                    <img style={shirtStyle}className="left-feet" src="static/zombieparts/left-feet-1@2x.png" alt="left feet" />
                    <img style={shirtStyle}className="right-feet" src="static/zombieparts/right-feet-1@2x.png" alt="right feet" />
                    <img style={shirtStyle}className="left-leg" src="static/zombieparts/left-leg-1@2x.png" alt="left leg" />
                    <img style={shirtStyle}className="right-leg" src="static/zombieparts/right-leg-1@2x.png" alt="right leg" />
                    <img style={shirtStyle}className="left-thigh" src="static/zombieparts/left-thigh-1@2x.png" alt="left thigh" />
                    <img style={shirtStyle}className="right-thigh" src="static/zombieparts/right-thigh-1@2x.png" alt="right thigh" />

                    <img  style={skinStyle} className="right-upper-arm" src="static/zombieparts/right-upper-arm-1@2x.png" alt="right upper arm" />
                    <img  style={shirtStyle}className="torso" src="static/zombieparts/torso-1@2x.png" alt="torso" />
                    <img  style={shirtStyle} className="shirt" src={this.currentShirtChoice()} alt="shirt" />
                    <img  style={skinStyle} className="left-forearm" src="static/zombieparts/left-forearm-1@2x.png" alt="left forearm" />
                    <img  style={skinStyle} className="right-forearm" src="static/zombieparts/right-forearm-1@2x.png" alt="right forearm" />
                    <img  style={skinStyle} className="left-upper-arm" src="static/zombieparts/left-upper-arm-1@2x.png" alt="left upper arm" />
                    <img  style={skinStyle} className="left-hand" src="static/zombieparts/hand1-1@2x.png" alt="left hand" />
                    <img  style={skinStyle} className="right-hand" src="static/zombieparts/hand-2-1@2x.png" alt="right hand" />
                    <img  style={skinStyle} className="head" src={this.currentHeadChoice()} alt="head" />
                    <img  style={eyeStyle}  className="eye"  src={this.currentEyeChoice()} alt="eyes" />
                    <img  className="mouth" src="static/zombieparts/mouth-1@2x.png" alt="mouth" />
                </div>
            )
        }

    }
}

export default ZombieChar;

//                      <img  style={{filter: "hue-rotate(90deg)"}} className="head" src={this.currentHeadChoice()} />