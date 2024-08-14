/**
 * Created 23.01.2020.
 */

public with sharing class GanttData {

    @RemoteAction
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getTasks() {
        
        // fetching the Records via SOQL
        List<GanttTask__c> Tasks = new List<GanttTask__c>();
        Tasks = [SELECT Id, Name, Start_Date__c, Duration__c, Parent__c FROM GanttTask__c];

        List<GanttLink__c> Links = new List<GanttLink__c>();
        Links = [SELECT Id, Type__c, Source__c, Target__c FROM GanttLink__c];

        List<GanttResource__c> Resources = new List<GanttResource__c>();
        Resources = [SELECT Id, Name FROM GanttResource__c];

        List<GanttResourceAssignment__c> Assignments = new List<GanttResourceAssignment__c>();
        Assignments = [SELECT Id, Task__c, Resource__c, Mode__c, Value__c, Delay__c, Duration__c, Start_Date__c, End_Date__c FROM GanttResourceAssignment__c];

        Map<String, Object> result = new Map<String, Object>{'tasks' => Tasks, 'links' => Links, 'resources' => Resources, 'assignments' => Assignments };
        return result;
   }
}