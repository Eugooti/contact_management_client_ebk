import {Step, StepLabel, Stepper} from "@mui/material";
import {useState} from "react";
import Heading from "../../../Components/Headings/Heading.jsx";
import {AnimatePresence} from "framer-motion";
import OrganizationProfileForm from "./PrivateOrganizationProfile.jsx";
import AddressForm from "../UniversalComponents/AddressForm.jsx";
import ContactsForm from "../UniversalComponents/ContactsForm.jsx";
import OrganizationReview from "../UniversalComponents/OrganizationReview.jsx";

const PrivateOrganization = () => {
    const steps = [
        { title: "Profile", content: "ministry_profile" },
        { title: "Contacts", content: "ministry_contacts" },
        { title: "Addresses", content: "ministry_address" },
        { title: "Confirm Details", content: "confirm_details" },
    ].map((step, index) => ({
        ...step,
        key: index,
    }));
    const [currentStep, setCurrentStep] = useState(0);
    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    }
    const nextStep = () => {
        setCurrentStep(prevStep=>prevStep + 1);
    }

    return (
        <div className='p-7'>
            <Heading title={'New Private Organization Contact'}/>
            <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((item) => (
                    <Step key={item.key}>
                        <StepLabel>
                            <label className="text-lg font-sans">{item.title}</label>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <AnimatePresence exitBeforeEnter>
                {currentStep===0&&<OrganizationProfileForm nextStep={nextStep} />}

                {currentStep===1&&<ContactsForm nextStep={nextStep} prevStep={prevStep}/>}

                {currentStep===2&&<AddressForm nextStep={nextStep} prevStep={prevStep}/>}

                {currentStep===3&&<OrganizationReview setCurrentStep={setCurrentStep}/>}
            </AnimatePresence>

            {}
        </div>
    )
}

export default PrivateOrganization;