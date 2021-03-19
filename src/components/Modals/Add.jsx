import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export default class Add extends Component {
    constructor(props){
        super(props)

        this.state = {
            currentAddArtistIMGURL: "",
            artists: this.props.artists
        }
    }

    componentDidMount(){
        this.setState({artists: this.props.artists})
        console.log(this.state.artists)
    }
    
    hideAddModal = e => {
        let addModal = document.querySelector('.addModal')
        if(e.target === addModal) addModal.style.display = "none"
    }

    hideAddModalX = e => {
        document.querySelector('.addModal').style.display = "none"
    }

    addImage = e => {
        let p2 = document.querySelector('.addImage p:last-child')
        p2.style.display = "block"

        this.setState({currentAddArtistIMGURL: prompt('enter image URL')})
    }

    post = (event) => {
        let props = document.querySelectorAll(".postArtistprop")

        let highest = 0;
        for (let index = 0; index < this.props.artists.length; index++) {
            const element = this.props.artists[index];
            if(parseInt(element[4]) > highest) highest = parseInt(element[4])
        }
        highest++

        axios.post('http://localhost:4000/api/artists', `name=${props[0].value}&imgURL=${this.state.currentAddArtistIMGURL}&wikipedia=${props[2].value}&id=${highest}&artwork=${props[1].value}`)

        let temp = this.props.artists
        temp.push(["", props[0].value, this.state.currentAddArtistIMGURL, props[2].value, highest, props[1].value])
        this.setState({artists: temp})

        for (let index = 0; index < props.length; index++) {
            let element = props[index];
            element.value = ""
        }

        let addModal = document.querySelector('.addModal')
        addModal.style.display = "none"

        console.log(temp)
        this.props.parentCallback(temp)
    }

    render() {
        return(
            <div className="addModal modal" onClick={this.hideAddModal} style={{display: 'none'}}>
                <div className="addContent modal-content">
                    <div className="modal-close-icon" onClick={this.hideAddModalX}>
                        <FontAwesomeIcon className="modal-close-icon" icon={faTimesCircle}/>
                    </div>
                    <h2>Add an Artist</h2>
                    <div className="artist">
                        <div className="addImage" onClick={this.addImage}>
                            <FontAwesomeIcon className="icon" icon={faPlusCircle}/>
                            <p>Add Image</p>
                            <p>{this.state.currentAddArtistIMGURL}</p>
                        </div>
                        <input className="postArtistprop" type="text" placeholder="Name"/>
                        <input className="postArtistprop" type="text" placeholder="Artwork title"/>
                        <input className="postArtistprop" type="text" placeholder="Wikipedia"/>
                        <button onClick={this.post}>submit</button>
                    </div>
                </div>
            </div>
        )
    }
}