import React from 'react';
import Hero from '../../Components/Hero/Hero';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import BenefitsSection from './BenefitsSection';
import CustomerReviews from './CustomerReviews';
import LatestBlogs from './LatestBlogs';
import Subscribtion from './Subscribtion';
import MeetOurAgents from './MeetOurAgents';

const Home = () => {
    return (
        <div>
          <Hero></Hero>
          <PopularPolicies></PopularPolicies>
         <BenefitsSection></BenefitsSection>
         <CustomerReviews></CustomerReviews>
         <LatestBlogs></LatestBlogs>
         <Subscribtion></Subscribtion>
         <MeetOurAgents></MeetOurAgents>
        </div>
    );
};

export default Home;