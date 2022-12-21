import React, { useState, useEffect, useRef } from 'react'
import './CalendarHome.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calendar.css'
import { BiPlusCircle } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

import jan_image from '../../assets/Images/january_image.svg'
import feb_image from '../../assets/Images/feburary_image.svg'
import mar_image from '../../assets/Images/march_image.svg'
import apr_image from '../../assets/Images/april_image.svg'
import may_image from '../../assets/Images/may_image.svg'
import jun_image from '../../assets/Images/june_image.svg'
import jul_image from '../../assets/Images/july_image.svg'
import aug_image from '../../assets/Images/august_image.svg'
import sep_image from '../../assets/Images/september_image.svg'
import oct_image from '../../assets/Images/october_image.svg'
import nov_image from '../../assets/Images/november_image.svg'
import dec_image from '../../assets/Images/december_image.svg'
import no_events from '../../assets/Images/noEvents_image.svg'

import PopUp from '../PopUp/PopUp';
import { MdDelete } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';

function CalendarHome() {

    const [calImages, setCalImages] = useState([
        {
            name: "january",
            id: "1",
            imageUrl: jan_image

        },
        {
            name: "feb",
            id: "2",
            imageUrl: feb_image

        },
        {
            name: "march",
            id: "3",
            imageUrl: mar_image
        },
        {
            name: "march",
            id: "4",
            imageUrl: apr_image

        },
        {
            name: "march",
            id: "5",
            imageUrl: may_image

        },
        {
            name: "march",
            id: "6",
            imageUrl: jun_image

        },
        {
            name: "march",
            id: "7",
            imageUrl: jul_image

        },
        {
            name: "march",
            id: "8",
            imageUrl: aug_image

        },
        {
            name: "march",
            id: "9",
            imageUrl: sep_image

        },
        {
            name: "march",
            id: "10",
            imageUrl: oct_image

        },
        {
            name: "march",
            id: "11",
            imageUrl: nov_image

        },
        {
            name: "march",
            id: "12",
            imageUrl: dec_image

        },
    ]);


    var currentD = new Date();
    const [selectedDate, setSelectedDate] = useState(currentD);
    const [clickedWeekDay, setClickedWeekDay] = useState("");
    const [clickedMonth, setClickedMonth] = useState("");
    const [clickedDay, setClickedDay] = useState("");
    const [selectedImage, setSelectedImage] = useState(jan_image);
    const [buttonPopUp, setButtonPopUp] = useState(false);
    const [addCalendarButton, setAddCalendarButton] = useState(false);
    const [checked, setChecked] = React.useState(true);


    //Used to open or close the event popup
    const [showEvent, setShowEvent] = useState(false);

    //Open or close when clicked on an event

    const [editEventPopup, setEditEventPopup] = useState(false);

    //Event form details (8 fields)
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formStartDate, setFormStartDate] = useState("");
    const [formEndDate, setFormEndDate] = useState("");
    const [formTime, setFormTime] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formTags, setFormTags] = useState("")
    const [formCalendar, setFormCalendar] = useState("");

    //Usestate to store all the events
    const [eventsBucket, setEventsBucket] = useState([]);

    //This will store a single event
    const [singleEvent, setSingleEvent] = useState({});

    //Highlight events bucket
    const [mark, setMark] = useState([]);

    //This bucket will store all the calendars
    const [calendarBucket, setCalendarBucket] = useState([]);

    const [calendarName, setCalendarName] = useState("");

    //Popup trigger for deleting a calendar
    const [deleteCalPopup, setDeleteCalPopup] = useState(false);
    const [delCalId, setDelCalId] = useState("");
    const [delCalName, setDelCalName] = useState("");

    const [calendarNamesArray, setCalendarNamesArray] = useState([]);

    //for encoding our image file
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const uploadHandler = async (e, imageKey) => {
        console.log(e.target.files);
        const file = await getBase64(e.target.files[0]);

        axios
            .post(
                "https://uv2ucx62n8.execute-api.us-east-1.amazonaws.com/live/businusquery/uploadCalImages",
                { uploadImage: file, imageName: e.target.files[0].name }
            )
            .then((response) => {

                if (response.status === 200) {
                    let tempArray = calImages;

                    let found = tempArray.find((item, i) => {
                        return item.id == imageKey;
                    })
                    found.imageUrl = response.data.Location;
                    setCalImages([...tempArray]);
                }

                // console.log(response.Location)

                alert("Calendar Image Updated successfully !")
            })
            .catch((err) => {
                console.log(err);
            });
    };



    //This function will create a new event on given date
    const addEvent = (formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar) => {
        axios.post('https://hluvwig96c.execute-api.us-east-1.amazonaws.com/live/businusquery/event',
            {
                eventStartDate: new Date(formStartDate),
                eventNewId: `${formStartDate}`,
                eventName: formTitle,
                eventDesc: formDescription,
                eventEndDate: formEndDate,
                eventTime: formTime,
                eventLocation: formLocation,
                eventTags: formTags,
                calendarName: formCalendar
            })
            .then(function (response) {
                // console.log(response);
                alert("Event Added !");
                window.location.reload();
                // console.log("Event added successfully !");
            })
            .catch(function (error) {
                console.log(error);
                console.log("Failed !");
            });
    }
    //Function to fetch all the events

    const getEvents = async () => {
        axios.get('https://hluvwig96c.execute-api.us-east-1.amazonaws.com/live/businusquery/events')
            .then((response) => {
                const myData = response.data;
                setEventsBucket(myData);
                // console.log(eventsBucket);
                // console.log("Data fetched successfully !");
                // console.log(myData)
                highlightEvents(myData);
            })
            .catch((error) => {
                console.log(error);
                console.log("Data fetching went wrong !");
            })

    }

    //Set highlighted 
    const highlightEvents = (a, b) => {
        const evHol = [];
        console.log("Calendar name array : " + calendarNamesArray);
        a.forEach((item) => {
            if (calendarNamesArray.find(x => x === item.calendarName)) {
                evHol.push(item.eventNewId);
            }
        })
        setMark(evHol)
        // console.log("Highlight : " + mark)

    }

    //Get a single event (When clicked on that event card)
    const viewEvent = (eventId) => {
        axios.get(`https://hluvwig96c.execute-api.us-east-1.amazonaws.com/live/businusquery/getEventById/${eventId}`)
            .then((response) => {
                console.log(response);
                const myData = response.data;
                setSingleEvent(myData);
                console.log("You have clicked on an event !");

            })
            .catch((error) => {
                console.log(error);
                console.log("Event fetching went wrong !");
            })
    }

    //Delete an event
    const deleteEvent = (eventId) => {
        axios.delete(`https://hluvwig96c.execute-api.us-east-1.amazonaws.com/live/businusquery/deleteEvent/${eventId}`)
            .then(() => {
                alert("Event Deleted !");
                window.location.reload();
            });
    }

    //Function to delete an event
    const editEvent = (selectedEvent, formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar) => {
        console.log("Edit this event!")
        console.log(selectedEvent);
        axios.put(`https://hluvwig96c.execute-api.us-east-1.amazonaws.com/live/businusquery/event/${selectedEvent.id}`,
            {
                eventStartDate: new Date(formStartDate),
                eventNewId: `${formStartDate}`,
                eventName: formTitle,
                eventDesc: formDescription,
                eventEndDate: formEndDate,
                eventTime: formTime,
                eventLocation: formLocation,
                eventTags: formTags,
                calendarName: formCalendar,

            })
            .then(function (response) {
                alert("Event Edited !");
                window.location.reload();
                console.log("Event edited successfully !");
            })
            .catch(function (error) {
                console.log(error);
                console.log("Edit failed !");
            });

    }

    const setClickedDate = (a, b, c, x, y) => {
        // console.log(selectedDate);
        const d = new Date(selectedDate);
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        setClickedMonth(month[d.getMonth()]);
        setClickedDay(d.getDate());
        setClickedWeekDay(weekday[d.getDay()]);
        const homeImages = [jan_image, feb_image, mar_image, apr_image, may_image, jun_image,
            jul_image, aug_image, sep_image, oct_image, nov_image, dec_image]

        // setSelectedImage(homeImages[d.getMonth()]);

        setSelectedImage(calImages[d.getMonth()].imageUrl);

        console.log(d.getMonth());
    }
    const setFormData = (a, b, c, d, e, f, g, h) => {

    }

    const ref = useRef(null);

    // const [calendarNamesArray, setCalendarNamesArray] = useState([]);
    // API call to get all calendars
    const getCalendar = async () => {
        axios.get('https://uv2ucx62n8.execute-api.us-east-1.amazonaws.com/live/businusquery/calendars')
            .then((response) => {
                const myData = response.data;



                setCalendarBucket(myData);
                console.log("Calendar fetched !");
                setcalfilterarray(myData)

                const el2 = ref.current;

                console.log(myData)


                el2.click();
                // el2.click();
                console.log(el2);

                // handleClick ();
                // document.getElementById("cal-checkbox").click();
            })
            .catch((error) => {
                console.log(error);
                console.log("Calendar fetching went wrong !");
            })
    }




    //API call to add a calendar
    const addCalendar = (name) => {
        axios.post('https://uv2ucx62n8.execute-api.us-east-1.amazonaws.com/live/businusquery/calendar',
            {
                calendarName: name,
                calendarCheckStatus: "true"
            })
            .then(function (response) {
                alert("Calendar Added !");
                window.location.reload();
            })
            .catch(function (error) {
                console.log("Failed !");
            });
    }

    //Set calendar name
    const calName = (a) => {
        // console.log("This is my calendar : " + calendarName);
    }

    //Delete a calendar
    const deleteCalendar = (eventId) => {
        axios.delete(`https://uv2ucx62n8.execute-api.us-east-1.amazonaws.com/live/businusquery/deleteCalendar/${eventId}`)
            .then(() => {
                alert("Calendar Deleted !");
                window.location.reload();
            });
    }

    //Edit calendar

    const changeCalendarStatus = (a, id) => {
        axios.put(`https://uv2ucx62n8.execute-api.us-east-1.amazonaws.com/live/businusquery/calendar/${id}`,
            {
                calendarCheckStatus: a

            })
            .then(function (response) {
                console.log("Calendar edited successfully !");
            })
            .catch(function (error) {
                console.log(error);
                console.log("Edit failed !");
            });
    }

    //Calendar name
    const setcalfilterarray = (a) => {
        const evHol = [];
        a.forEach((item) => {

            let myBool = (item.calendarCheckStatus === 'true');
            if (item.calendarCheckStatus) {
                // console.log(item.calendarCheckStatus);
                evHol.push(item.calendarName);
            }


        })
        setCalendarNamesArray(evHol);
        console.log(evHol);
        console.log(a);
    }

    const runDeleteCal = (a, b) => {

    }

    useEffect(() => {
        setClickedDate(selectedDate, clickedWeekDay, clickedMonth, clickedDay, selectedImage);

        setFormData(formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar);

        //This call will fetch all calendars
        // getCalendar();
        //This will add a calendar
        calName(calendarName);

        runDeleteCal(delCalId, delCalName);


    }, [selectedDate, clickedWeekDay, clickedMonth, clickedDay, selectedImage,
        formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar, singleEvent,
        calendarName, delCalId, delCalName
    ])



    useEffect(() => {

        getEvents();
        getCalendar();



        // document.getElementById("cal-checkbox").click();
        console.log("Just Once");

    }, [])




    return (
        <>
            <div className='calendar_container'>
                <div className="calendar_innercontainer">

                    <div className="addEvents_container">

                        <div className="create_button">
                            <button
                                onClick={() => {
                                    setButtonPopUp(true);
                                }}
                            ><BiPlusCircle size={25} />Create</button>
                        </div>

                        <div className="my_calenders">

                            <div className='my_calenders_headers'>
                                <p>Calendars</p>
                            </div>

                            <div className="my_calenders_checkbox_holder">


                                {
                                    calendarBucket.map((cl) => {
                                        return <div className="calendar_name" key={cl.id}>

                                            <div>
                                                <input type="checkbox" name={cl.id}
                                                    // id={cl.id}
                                                    id="cal-checkbox"
                                                    ref={ref}

                                                    value={cl.calendarCheckStatus}
                                                    defaultChecked={cl.calendarCheckStatus}

                                                    onChange={(e) => {
                                                        console.log("Before Change : " + cl.calendarCheckStatus)
                                                        if (e.target.checked) {
                                                            console.log('✅ ' + cl.calendarName + ' is checked');
                                                            changeCalendarStatus(true, cl.id);
                                                            let x = calendarNamesArray;
                                                            x.push(cl.calendarName);
                                                            setCalendarNamesArray(x);
                                                            console.log(calendarNamesArray);

                                                        } else {
                                                            console.log('⛔️ ' + cl.calendarName + '  is NOT checked');
                                                            changeCalendarStatus(false, cl.id);
                                                            let arr = calendarNamesArray;
                                                            for (var i = arr.length; i--;) {
                                                                if (arr[i] === cl.calendarName) arr.splice(i, 1);
                                                            }
                                                            setCalendarNamesArray(arr);
                                                            console.log(calendarNamesArray);
                                                        }
                                                        getEvents();

                                                        // console.log(calendarNamesArray);
                                                        // console.log(mark);

                                                    }
                                                    }
                                                />
                                                <label htmlFor={cl.id}>{cl.calendarName}</label><br />
                                            </div>

                                            <div className='delete_calendar'>

                                                <BsThreeDots
                                                    onClick={() => {
                                                        setDelCalId(cl.id);
                                                        setDelCalName(cl.calendarName);
                                                        console.log(delCalId)
                                                        console.log(delCalName)
                                                        setDeleteCalPopup(true);
                                                    }}

                                                />
                                            </div>

                                        </div>
                                    })
                                }


                            </div>
                            <div className='add_calenders my_calenders_headers'>
                                <p>Add Calendars</p>
                                <FaPlus onClick={() => {
                                    setAddCalendarButton(true);
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className="calendar_innercontainer_sec1">
                        <div className="calender_sec1_one">
                            <div className="calendar_sec1_image_holder">
                                {/* <img src={selectedImage} alt="" /> */}
                                <img src={calImages[7].imageUrl} alt="" />

                                {/* {calImages.map((item, i) => {
                                        return (
                                            <img src={item.imageUrl} className="cal-images" alt="" />
                                        );
                                })} */}



                            </div>
                            <div className="edit_icon_holder">
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => {
                                        uploadHandler(e, 8);
                                    }}
                                />
                                <label htmlFor="file">
                                    <i ><FiEdit size={30} /></i>
                                </label>
                            </div>

                        </div>
                        <div className="calender_sec1_two">

                            <Calendar
                                onChange={(value, e) => {
                                    setSelectedDate(value);
                                    setClickedDate(selectedDate, clickedWeekDay, clickedMonth, clickedDay, selectedImage);
                                }}

                                tileClassName={({ date, view }) => {
                                    if (mark.find(x => x === date.toString())) {
                                        return 'highlight'
                                    }
                                }}
                            />

                        </div>
                    </div>
                    <div className="calendar_innercontainer_sec2">
                        <div className="calender_sec2_one">
                            <h2>{clickedMonth}</h2>
                            <h1>{clickedWeekDay}, {clickedDay}</h1>
                            <p>Events</p>
                        </div>
                        {/* {
                            showEvents ?


                                "" :
                                // <div className="calender_sec2_two">
                                //     <div className="no_image_image_holder">
                                //         <img src={no_events} alt="No events" />
                                //     </div>
                                //     <h2 className='noEvents_header'>Hurray!!</h2>
                                //     <p>There Are No Events Today</p>
                                // </div> :
                                // <div className='show-events-container'>
                                //     <div className="show-events-inner">
                                //         <h2>{formTitle}</h2>
                                //         <p>
                                //             {formDescription}
                                //         </p>
                                //         <p><label>Due Date : </label>{formEndDate}</p>
                                //         <p><label>Time : </label>{formTime}</p>
                                //     </div>
                                // </div>

                                <div className='show-events-container'>
                                    {
                                        eventsBucket.map((ev) => (
                                            <div className="show-events-inner">
                                                <h2>{ev.eventName}</h2>
                                                <p>
                                                    {ev.eventDesc}
                                                </p>
                                                <p><label>Due Date : </label>{ev.eventEndDate}</p>
                                                <p><label>Time : </label>{ev.eventTime}</p>
                                            </div>
                                        ))
                                    }
                                </div>


                        } */}

                        <div className='show-events-container'>
                            {
                                eventsBucket.map((ev) => {

                                    // mark.find(x => x === date.toString())

                                    if (selectedDate == ev.eventNewId && calendarNamesArray.find(x => x === ev.calendarName)) {
                                        // if (selectedDate == ev.eventNewId) {

                                        return <div className="show-events-inner" key={ev.id}
                                            onClick={() => {
                                                setShowEvent(true);
                                                viewEvent(ev.id);
                                            }}
                                        >
                                            <div className='card-calendar-name'><p >{ev.calendarName}</p></div>
                                            <h2>{ev.eventName}</h2>
                                            <p>
                                                {ev.eventDesc}
                                            </p>
                                            <p><label>Due Date : </label>{ev.eventEndDate}</p>
                                            {ev.eventTime === "" ? "" : <p><label>Time : </label>{ev.eventTime}</p>}
                                        </div>;
                                    }
                                    return null;


                                })
                            }
                        </div>
                    </div>

                </div>
            </div>

            {/* //Popup for form */}
            <PopUp trigger={buttonPopUp} setTrigger={setButtonPopUp}>
                <div className="popup-divs popup-date">
                    <label>Select Event Date</label>
                    <input type="date"
                        onChange={(e) => {
                            const d = new Date(e.target.value);
                            d.setHours(0, 0, 0, 0);
                            setFormStartDate(d);
                            console.log(d)
                        }}
                    />
                </div>
                <div className="popup-divs popup-calendar">
                    <label>Select a Calendar</label>
                    <select onChange={(e) => {
                        setFormCalendar(e.target.value);
                    }}>

                        {
                            calendarBucket.map((op) => {
                                return <option value={op.calendarName} key={op.id} >{op.calendarName}</option>
                            })
                        }
                        {/* <option value="Calendar1">Calendar - 1</option>
                        <option value="Calendar2">Calendar - 2</option> */}
                    </select>
                </div>
                <div className="popup-divs popup-title">
                    <label >Title</label>
                    <input type="text"
                        onChange={(e) => {
                            setFormTitle(e.target.value);

                        }}
                    />
                </div>
                <div className="popup-divs popup-description">
                    <label>Description</label>
                    <textarea
                        onChange={(e) => {
                            setFormDescription(e.target.value);
                        }}>
                    </textarea>
                </div>
                <div className="popup-divs popup-due">
                    <label>Due Date</label>
                    <input type="date"
                        onChange={(e) => {
                            setFormEndDate(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-time">
                    <label>Time</label>
                    <input type="time"
                        onChange={(e) => {
                            setFormTime(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-location">
                    <label >Location</label>
                    <input type="text"
                        onChange={(e) => {
                            setFormLocation(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-tags">
                    <label >Tags</label>
                    <input type="tag"

                        onChange={(e) => {
                            setFormTags(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-buttons">
                    <button onClick={() => { setButtonPopUp(false) }} id="form_close">
                        Close
                    </button>
                    <button onClick={() => {

                        if (formTitle === "" || formStartDate === "" || formCalendar === "") {
                            alert("Please fill all required field !")
                        } else {
                            setButtonPopUp(false);
                            addEvent(formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar);
                        }
                    }}>
                        Submit
                    </button>
                </div>
            </PopUp>

            {/* //Popup for a particular event */}
            <PopUp trigger={showEvent} setTrigger={setShowEvent} className='selected-event-container'>
                <div className="selected-event-title">
                    <h2>{singleEvent.eventName}</h2>
                    <div className="edit_event_options">


                        <select onChange={(e) => {
                            console.log(e.target.value);

                            if (e.target.value === "delete") {
                                deleteEvent(singleEvent.id);
                                setShowEvent(false)
                            }
                            if (e.target.value === "edit") {
                                setEditEventPopup(true)
                                setShowEvent(false);
                            }
                        }} >
                            <option className='three-dot' value=".">•••</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>

                    </div>
                </div>
                {singleEvent.eventDesc === "" ? "" : <div className="selected-event-description">{singleEvent.eventDesc}</div>}
                <div className="selected-event-otherinfo">
                    <p><span>Date : </span> {singleEvent.eventStartDate}</p>
                    {singleEvent.eventTime === "" ? "" : <p><span>Time : </span>{singleEvent.eventTime}</p>}
                    {singleEvent.eventLocation === "" ? "" : <p><span>Location : </span>{singleEvent.eventLocation}</p>}
                    <p><span>Calendar : </span>{singleEvent.calendarName}</p>
                    {singleEvent.eventTags === "" ? "" : <p><span>Tags : </span> {singleEvent.eventTags}</p>}
                </div>
                <div className="selected-event-buttons">
                    <button id="selected-event-close-btn" onClick={() => setShowEvent(false)}>Close</button>
                    {/* <button id="selected-event-edit-btn" onClick={() => {
                        setEditEventPopup(true)
                        setShowEvent(false);
                        // editEvent(singleEvent);
                    }}>Edit</button>
                    <button id="selected-event-delete-btn" onClick={() => {
                        deleteEvent(singleEvent.id);

                        setShowEvent(false)
                    }} >Delete</button> */}
                </div>
            </PopUp>

            {/* //PopUp for adding a new calendar */}
            <PopUp trigger={addCalendarButton} setTrigger={setAddCalendarButton}>
                <div className="popup-calendar-container">
                    <div className="popup-calendar-input">
                        <label >Enter Calendar Name</label>
                        <input type="text"
                            onChange={(e) => {
                                setCalendarName(e.target.value);
                            }}
                        />
                    </div>
                    <button onClick={() => {
                        setAddCalendarButton(false);
                        addCalendar(calendarName);
                    }}>
                        Add Calendar
                    </button>
                </div>
            </PopUp>


            {/* Popup for editing an event */}
            <PopUp trigger={editEventPopup} setTrigger={setEditEventPopup}>
                <div className="popup-divs popup-date">
                    <label>Select Event Date</label>
                    <input type="date"
                        onChange={(e) => {

                            const d = new Date(e.target.value);
                            d.setHours(0, 0, 0, 0);
                            setFormStartDate(d);
                            console.log(d)
                        }}
                    />
                </div>
                <div className="popup-divs popup-calendar">
                    <label>Select a Calendar</label>
                    <select
                        placeholder={singleEvent.calendarName}
                        onChange={(e) => {

                            setFormCalendar(e.target.value);
                        }}>
                        {/* <option value="Calendar1">Calendar - 1</option>
                        <option value="Calendar2">Calendar - 2</option> */}

                        {
                            calendarBucket.map((op) => {
                                return <option value={op.calendarName} key={op.id} >{op.calendarName}</option>
                            })
                        }
                    </select>
                </div>
                <div className="popup-divs popup-title">
                    <label >Title</label>
                    <input type="text"
                        placeholder={singleEvent.eventName}
                        onChange={(e) => {

                            setFormTitle(e.target.value);

                        }}
                    />
                </div>
                <div className="popup-divs popup-description">
                    <label>Description</label>
                    <textarea
                        placeholder={singleEvent.eventDesc}
                        onChange={(e) => {
                            setFormDescription(e.target.value);
                        }}>
                    </textarea>
                </div>
                <div className="popup-divs popup-due">
                    <label>Due Date</label>
                    <input type="date"
                        onChange={(e) => {
                            setFormEndDate(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-time">
                    <label>Time</label>
                    <input type="time"
                        // placeholder={singleEvent.eventTime}
                        onChange={(e) => {
                            setFormTime(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-location">
                    <label >Location</label>
                    <input type="text"
                        placeholder={singleEvent.eventLocation}
                        onChange={(e) => {
                            setFormLocation(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-tags">
                    <label >Tags</label>
                    <input type="tag"
                        placeholder={singleEvent.eventTags}
                        onChange={(e) => {
                            setFormTags(e.target.value);
                        }}
                    />
                </div>
                <div className="popup-divs popup-buttons">
                    <button onClick={() => { setEditEventPopup(false) }} id="form_close">
                        Close
                    </button>
                    <button onClick={() => {
                        console.log(singleEvent);
                        editEvent(singleEvent, formTitle, formDescription, formStartDate, formEndDate, formTime, formLocation, formTags, formCalendar);
                        setEditEventPopup(false)
                    }}>
                        Edit
                    </button>
                </div>
            </PopUp>

            <PopUp trigger={deleteCalPopup} setTrigger={setDeleteCalPopup}>
                <div className="del-cal-popup-container">
                    <p>Do you want to delete <span>'{delCalName}'</span> ?</p>
                </div>
                <div className="del-cal-buttons">
                    <button id="close-del-cal"
                        onClick={() => {
                            setDeleteCalPopup(false);
                        }}
                    >Close</button>
                    <button id="delete-del-cal" onClick={() => {
                        deleteCalendar(delCalId);
                        setDeleteCalPopup(false);

                    }}>Delete</button>
                </div>
            </PopUp>

        </>
    )
}

export default CalendarHome