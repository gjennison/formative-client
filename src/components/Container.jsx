import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'


export default class Container extends Component{
    constructor(props){
        super(props)

        this.state = {
            artists: [],
            showPost: false,
            showUpdate: false,
            currentUpdateIndex: 0,
        }
    }
    
    componentDidMount() {
        axios.get("http://localhost:4000/api/artists").then(res => {
            let temp = []
            res.data.forEach(el => {
                temp.push(Object.values(el))
            })
            this.setState({artists: temp})
        })

        
    }

    delete(index){
        axios.delete(`http://localhost:4000/api/artists/${index}`, {params: {}})
    }

    post = (event) => {
        let props = document.querySelectorAll(".postProp")

        axios.post('http://localhost:4000/api/artists', `name=${props[0].value}&imgURL=${props[1].value}&wikipedia=${props[2].value}`)
    }

    update = e => {

        let wikipedia = e.target.previousSibling.value
        let imgUrl = e.target.previousSibling.previousSibling.value
        let name = e.target.previousSibling.previousSibling.previousSibling.value
        let index = e.target.nextSibling.innerHTML

        console.log(`wikipedia: ${wikipedia}, img url: ${imgUrl}, name: ${name}, index: ${index}`)

        axios.put(
            `http://localhost:4000/api/artists/${index}`,
            `name=${name}&imgURL=${imgUrl}&wikipedia=${wikipedia}`
          )
    }
    
    showUpdate(index){
        let rights = document.querySelectorAll('.right')

        if(rights[index].style.display === "flex") rights[index].style.display = "none"
        else rights[index].style.display = "flex"
    }

    add = e => {
        if(this.state.showPost) this.setState({showPost: false})
        else this.setState({showPost: true})
    }
    
    render(){
        let post = ""
        let status = <FontAwesomeIcon className="icon" icon={faPlusCircle} />
        if(this.state.showPost) {
            
            post = <div className="post">
                <input type="text" placeholder="name" className="postProp"/>
                <input type="text" placeholder="img url" className="postProp"/>
                <input type="text" placeholder="wikipedia" className="postProp"/>
                <button onClick={this.post}>submit</button>
            </div>
            status = <FontAwesomeIcon className="icon" icon={faTimesCircle} />
        }

        return(
            <React.Fragment>
                <div className="container">
                    {this.state.artists.map((value, index) => 
                        <div className="artist" key={index}>
                            <div className="left">
                                <img src={value[2]} alt=""/>
                                <h4>{value[1]}</h4>
                                <a href={value[3]}>wikipedia</a>
                                <div className="icons">
                                    <div>
                                    <FontAwesomeIcon className="icon" onClick={() => this.delete(index)} icon={faTrash} />
                                    </div>
                                    <div>
                                    <FontAwesomeIcon className="icon" onClick={() => this.showUpdate(index)} icon={faPencilAlt} />
                                    </div>
                                </div>
                            </div>

                            <div className="right" style={{display: 'none'}}>
                                <input type="text" placeholder="name" className="updateProp"/>
                                <input type="text" placeholder="img url" className="updateProp"/>
                                <input type="text" placeholder="wikipedia" className="updateProp"/>
                                <button onClick={this.update}>submit</button>
                                <p style={{display: 'none'}}>{index}</p>
                            </div>
                        </div>
                    )}

                    <div className="artist">
                        <div id="add" onClick={this.add}>{status}</div>
                        {post}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}