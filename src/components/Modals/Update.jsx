import React, {Component} from 'react';

export default class Update extends Component{
    constructor(props){
        super(props)

        this.state = {
            currentUpdateIMG: "",
            artists: this.props.artists,
        }
    }

    hideUpdateModal = e => {
        let updateModal = document.querySelector('.updateModal')
        if(e.target === updateModal) updateModal.style.display = "none"
    }

    hideUpdateModalX = e => {
        document.querySelector('.updateModal').style.display = "none"
    }

    updateIMG = e => {
        this.setState({currentUpdateIMG: prompt("enter image url")})
    }

    update = e => {

        let props = document.querySelectorAll('.updateArtistprop')
        console.log(props)

        let name = props[0].value
        let title = props[1].value
        let wikipedia = props[2].value
        let imgUrl = this.state.currentUpdateIMG
        let index = this.state.currentUpdateIndex

        console.log(`wikipedia: ${wikipedia}, img url: ${imgUrl}, name: ${name}, index: ${index}`)

        axios.put(
            `http://localhost:4000/api/artists/${index}`,
            `name=${name}&imgURL=${imgUrl}&wikipedia=${wikipedia}&artwork=${title}`
          )

        let temp = this.state.artists

        for (let x = 0; x < temp.length; x++) {
            let element = temp[x];
            if(element[4] === index) {
                element[1] = name
                element[2] = imgUrl
                element[3] = wikipedia
                element[5] = title

                temp[x] = element
                console.log(temp)
                console.log(element)
            }
            // element is the updated element in the artists array
            // now need to update the artists array to include the new element
            this.setState({artists: temp})
        }
    }


    render() {
        return(
            <div className="updateModal modal" onClick={this.hideUpdateModal} style={{display: 'none'}}>
                <div className="updateContent modal-content">
                    <div className="modal-close-icon" onClick={this.hideUpdateModalX}>
                        <FontAwesomeIcon className="modal-close-icon" icon={faTimesCircle}/>
                    </div>
                    <h2>Edit Info</h2>
                    <div className="artist">
                        <img onClick={this.updateIMG} src={this.state.currentUpdateIMG} alt=""/>
                        <input className="updateArtistprop" type="text" placeholder="Name"/>
                        <input className="updateArtistprop" type="text" placeholder="Artwork title"/>
                        <input className="updateArtistprop" type="text" placeholder="Wikipedia"/>
                        <button onClick={this.update}>submit</button>
                    </div>
                </div>
            </div>
        )
    }
}