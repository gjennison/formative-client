import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Add from './Modals/Add';

export default class Container extends Component{
    constructor(props){
        super(props)

        this.state = {
            artists: [],
            showPost: false,
            showUpdate: false,
            currentUpdateIndex: 0,
            currentUpdateIMGURL: "",
            currentAddArtistIMGURL: "",
            currentDeleteIndex: 0,
            currentDeleteArrayIndex: 0,
        }
    }
    
    componentDidMount() {
        axios.get("http://localhost:4000/api/artists").then(res => {
            let temp = []
            res.data.forEach(el => {
                temp.push(Object.values(el))
            })
            this.setState({artists: temp})
            console.log(temp)
        })
        
    }

    delete(index, arrayIndex){
        
        this.setState({currentDeleteIndex: index, currentDeleteArrayIndex: arrayIndex})
        
        let deleteModal = document.querySelector('.deleteModal')
        deleteModal.style.display = "flex"
    }

    closeDeleteModal(){
        let deleteModal = document.querySelector('.deleteModal')
        deleteModal.style.display = "none"
    }

    closeDeleteModalGreySpaceClick = e => {
        let deleteModal = document.querySelector('.deleteModal')
        if(e.target === deleteModal) deleteModal.style.display = "none"
    }
    
    confirmDelete = e => {
        axios.delete(`http://localhost:4000/api/artists/${this.state.currentDeleteIndex}`, {params: {}})
        console.log(`deleted: ${this.currentDeleteIndex}`)
        
        let temp = this.state.artists
        temp.splice(this.state.currentDeleteArrayIndex, 1)
        
        this.setState({artists: temp})

        this.closeDeleteModal();
    }

    post = (event) => {
        let props = document.querySelectorAll(".postArtistprop")

        let highest = 0;
        for (let index = 0; index < this.state.artists.length; index++) {
            const element = this.state.artists[index];
            if(parseInt(element[4]) > highest) highest = parseInt(element[4])
        }
        highest++

        axios.post('http://localhost:4000/api/artists', `name=${props[0].value}&imgURL=${this.state.currentAddArtistIMGURL}&wikipedia=${props[2].value}&id=${highest}&artwork=${props[1].value}`)

        let temp = this.state.artists
        temp.push(["", props[0].value, this.state.currentAddArtistIMGURL, props[2].value, highest, props[1].value])
        this.setState({artists: temp})

        for (let index = 0; index < props.length; index++) {
            let element = props[index];
            element.value = ""
        }

        let addModal = document.querySelector('.addModal')
        addModal.style.display = "none"
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
    
    showUpdate(index){
        this.setState({currentUpdateIMG: this.state.artists[index][2], currentUpdateIndex: this.state.artists[index][4]})

        let updateModal = document.querySelector('.updateModal')
        updateModal.style.display = "flex"

        let props = document.querySelectorAll('.updateArtistprop')

        props[0].value = this.state.artists[index][1]
        props[1].value = this.state.artists[index][5]
        props[2].value = this.state.artists[index][3]
    }

    updateIMG = e => {
        this.setState({currentUpdateIMG: prompt("enter image url")})
    }

    add = e => {
        if(this.state.showPost) this.setState({showPost: false})
        else this.setState({showPost: true})

        let addModal = document.querySelector('.addModal')
        addModal.style.display = "flex"
    }

    hideAddModal = e => {
        let addModal = document.querySelector('.addModal')
        if(e.target === addModal) addModal.style.display = "none"
    }

    hideAddModalX = e => {
        document.querySelector('.addModal').style.display = "none"
    }

    hideUpdateModal = e => {
        let updateModal = document.querySelector('.updateModal')
        if(e.target === updateModal) updateModal.style.display = "none"
    }

    hideUpdateModalX = e => {
        document.querySelector('.updateModal').style.display = "none"
    }

    addImage = e => {
        let p2 = document.querySelector('.addImage p:last-child')
        p2.style.display = "block"

        this.setState({currentAddArtistIMGURL: prompt('enter image URL')})
    }

    addCallbackFunction = (childData) => {
        this.setState({artists: childData})
    }
    
    render(){
        return(
            <React.Fragment>
                <header>
                    <div>
                        <h1><div>Digital&nbsp;</div> <div>Gallery</div></h1>
                        <p>Database of the worlds most well known artists</p>
                    </div>
                    <div id="addArtist" onClick={this.add}>
                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        <p>add an artist</p>
                    </div>
                </header>
                <div className="container">
                    {this.state.artists.map((value, index) => 
                        <div className="artist" key={index}>
                            <div>
                                <img src={value[2]} alt=""/>
                                <h2>{value[1]}</h2>
                                <p>(Work Above: "{value[5]}")</p>
                                <a href={value[3]}><button><strong>Find out more</strong></button></a>
                                <div className="gallery-icons">
                                    <div onClick={() => this.delete(value[4], index)}>
                                        <FontAwesomeIcon className="icon" icon={faTrash} />
                                    </div>
                                    <div onClick={() => this.showUpdate(index)}>
                                        <FontAwesomeIcon className="icon" icon={faPencilAlt} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="addModal modal" onClick={this.hideAddModal} style={{display: 'none'}}>
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
                    </div> */}

                    <div className="deleteModal modal" onClick={this.closeDeleteModalGreySpaceClick} style={{display: 'none'}}>
                        <div className="deleteContent modal-content">
                            <p>Are you sure you want to remove this artist?</p>
                            <hr/>
                            <div className="deleteIcons">
                                <div onClick={() => this.closeDeleteModal()}>
                                <FontAwesomeIcon icon={faTimesCircle} />
                                </div>
                                <div onClick={this.confirmDelete}>
                                <FontAwesomeIcon icon={faCheck}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="updateModal modal" onClick={this.hideUpdateModalX} style={{display: 'none'}}>
                        <div className="updateContent modal-content">
                            <div className="modal-close-icon" onClick={this.hideUpdateModal}>
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

                    <Add parentCallback = {this.addCallbackFunction} artists={this.state.artists} currentAddArtistIMGURL={this.state.currentAddArtistIMGURL}/>
                </div>
            </React.Fragment>
        )
    }
}