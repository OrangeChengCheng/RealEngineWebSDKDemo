#/*****************************************************************************
#* @brief: 用于倾斜摄影数据生成
#* @author: PO LI
#* @date: 2021/04/06 
#* @version: ver 1.0
#*****************************************************************************/

import sys
import os
import time
import json
import getopt
import ccmasterkernel




def reconstructionProcess(argv):

    #print('MasterKernel version %s' % ccmasterkernel.version())
    #print('')
    configPath = ''
    try:
        opts, args = getopt.getopt(argv,"hi:",["ifile="])
    except getopt.GetoptError:
        print ("test.py -i <inputfile>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print ("test.py -i <inputfile>")
            sys.exit()
        elif opt in ("-i", "--ifile"):
            configPath = arg
    
    if not ccmasterkernel.isLicenseValid():
        print("License error: ", ccmasterkernel.lastLicenseErrorMsg())
        sys.exit(0)
        return 1
    #print('11111111111111111111111111111111111')
    print('configPath:%s'%configPath)
    return readFile(configPath)
    
# --------------------------------------------------------------------
# Read Txt file
# --------------------------------------------------------------------
def readFile(configPath):
    with open(configPath,'r',encoding='utf-8') as fp:
        json_data = json.load(fp)
        #print('**********************************************')
        for i in range(0,len(json_data)):
             photosDirPath = json_data[i]['PicturePath']
             projectDirPath = json_data[i]['ProjectPath']
             srs =json_data[i]['SRS']
             presetPath =json_data[i]['PresetPath']
             
             centerPointX =0;centerPointY=0;centerPointZ=0
             centerPoint =json_data[i]['CenterPoint']
             #print('centerPointSize:%s'%len(centerPoint))
             if(len(centerPoint) == 3):
                  centerPointX=centerPoint[0]
                  centerPointY=centerPoint[1]
                  centerPointZ=centerPoint[2]
             else:
                  print('Error: Missing centerPoint sizes.')
                  sys.exit(0)

             pictureSize = json_data[i]['PictureSize']
             print('photosDirPath:%s'%photosDirPath)
             #print('projectDirPath:%s'%projectDirPath)
             #print('srs:%s'%srs)
             #print('presetPath:%s'%presetPath)
             #print('centerPoint:%s'%centerPoint)
             #print('pictureSize:%s'%pictureSize)
             #print('current progress:[%d/%d]'%(i+1,len(json_data)),end='\n')
             # --------------------------------------------------------------------
             # create project
             # --------------------------------------------------------------------
             project = createProject(projectDirPath)

             # --------------------------------------------------------------------
             # create block
             # --------------------------------------------------------------------
             block = createBlock(project,photosDirPath)

             # --------------------------------------------------------------------
             # AT 
             # --------------------------------------------------------------------
             blockAT = AT(project,block,presetPath) 

             # --------------------------------------------------------------------
             # Reconstruction
             # --------------------------------------------------------------------
             reconstruction = Reconstruction(blockAT,srs,centerPointX,centerPointY,centerPointZ)
    
             # --------------------------------------------------------------------
             # Production
             # --------------------------------------------------------------------
             production(project,reconstruction,pictureSize)
        return 0

def createProject(projectDirPath):
    #print('*****************************************************')
    #print('Project DirPath is: %s.' % projectDirPath)
    
    projectName = os.path.basename(projectDirPath)
    #print('Project DirPath is: %s .' % projectName)
    project = ccmasterkernel.Project()
    project.setName(projectName)
    project.setDescription('Automatically generated from python script')
    project.setProjectFilePath(os.path.join(projectDirPath, projectName))

    #print('Project %s successfully created.' % projectName)
    #print('')
    return project


# --------------------------------------------------------------------
# create block
# --------------------------------------------------------------------
def createBlock(project,photosDirPath):
    block=ccmasterkernel.Block(project)
    project.addBlock(block)

    block.setName('block #1')
    block.setDescription('input block')
    #block.setPhotoDownsamplingRate(1.0)
    photogroups = block.getPhotogroups()
    files = os.listdir(photosDirPath)

    for file in files:
        file = os.path.join(photosDirPath, file)

        # add photo, create a new photogroup if needed
        lastPhoto = photogroups.addPhotoInAutoMode(file)

        if lastPhoto is None:
            print('Could not add photo %s.' % file)
            continue

        # upgrade block positioningLevel if a photo with position is found (GPS tag)
        if not lastPhoto.pose.center is None:
            block.setPositioningLevel(ccmasterkernel.PositioningLevel.PositioningLevel_georeferenced)

    #print('read imgage file complete')

    # check block
    #print('%s photo(s) added in %s photogroup(s):' % (photogroups.getNumPhotos(), photogroups.getNumPhotogroups()))

    photogroups = project.getBlock(0).getPhotogroups()
    
    for i_pg in range(0, photogroups.getNumPhotogroups()):
        #print('photogroup #%s:' % (i_pg+1))
        if not photogroups.getPhotogroup(i_pg).hasValidFocalLengthData():
            print('Warning: invalid photogroup')
        #for photo_i in photogroups.getPhotogroup(i_pg).getPhotoArray():
            #print('image: %s' % photo_i.imageFilePath)

        #print('')

    if not block.isReadyForAT():
        if block.reachedLicenseLimit():
            print('Error: Block size exceeds license capabilities.')
        if block.getPhotogroups().getNumPhotos() < 3:
            print('Error: Insufficient number of photos.')
        else:
            print('Error: Missing focal lengths and sensor sizes.')
        sys.exit(0)
    return block


# --------------------------------------------------------------------
# AT 
# --------------------------------------------------------------------
def AT(project,block,presetPath):
    blockAT=ccmasterkernel.Block(project)
    project.addBlock(blockAT)
    blockAT.setBlockTemplate(ccmasterkernel.BlockTemplate.Template_adjusted, block)

    err = project.writeToFile()
    if not err.isNone():
        print(err.message)
        sys.exit(0)


    blockAT.getAT().setPositioningMode(ccmasterkernel.bindings.PositioningMode.PosMode_adjustmentFromGPSTags)
    ATSettings = blockAT.getAT().getSettings()
    ATSettings.loadPreset(presetPath)
    blockAT.getAT().setSettings(ATSettings);

    atSubmitError = blockAT.getAT().submitProcessing()
    if not atSubmitError.isNone():
        print('Error: Failed to submit aerotriangulation.')
        print(atSubmitError.message)
        sys.exit(0)

    print('The aerotriangulation job has been submitted and is waiting to be processed...')

    iPreviousProgress = 0
    iProgress = 0
    previousJobStatus = ccmasterkernel.JobStatus.Job_unknown
    jobStatus = ccmasterkernel.JobStatus.Job_unknown

    while 1:
        jobStatus = blockAT.getAT().getJobStatus()

        if jobStatus != previousJobStatus:
            print(ccmasterkernel.jobStatusAsString(jobStatus))

        if jobStatus == ccmasterkernel.JobStatus.Job_failed or jobStatus == ccmasterkernel.JobStatus.Job_cancelled or jobStatus == ccmasterkernel.JobStatus.Job_completed:
            break

        #if iProgress != iPreviousProgress:
            #print('%s%% - %s' % (iProgress,blockAT.getAT().getJobMessage()))

        iPreviousProgress = iProgress
        iProgress = blockAT.getAT().getJobProgress()
        time.sleep(1)
        blockAT.getAT().updateJobStatus()
        previousJobStatus = jobStatus

    if jobStatus != ccmasterkernel.JobStatus.Job_completed:
        print('"Error: Incomplete aerotriangulation.')

        if blockAT.getAT().getJobMessage() != '':
            print( blockAT.getAT().getJobMessage() )

    #print('Aerotriangulation completed.')

    if  not blockAT.isReadyForReconstruction():
        print('Error: Incomplete photos. Cannot create reconstruction.')
        sys.exit(0)

    #print('Ready for reconstruction.')

    if blockAT.getPhotogroups().getNumPhotosWithCompletePose_byComponent(1) < blockAT.getPhotogroups().getNumPhotos():
        print('Warning: incomplete photos. %s/%s photo(s) cannot be used for reconstruction.' % ( blockAT.getPhotogroups().getNumPhotos() - blockAT.getPhotogroups().getNumPhotosWithCompletePose_byComponent(1), blockAT.getPhotogroups().getNumPhotos() ) );
    return blockAT


# --------------------------------------------------------------------
# Reconstruction
# --------------------------------------------------------------------
def Reconstruction(blockAT,srs,centerPointX,centerPointY,centerPointZ):
    reconstruction = ccmasterkernel.Reconstruction(blockAT)
    
    if reconstruction.getNumInternalTiles() == 0:
        print('Error: Failed to create reconstruction layout.')
        sys.exit(0)

    # Add by lipo begin	
    # SRS
    if not reconstruction.setSRS(srs):
        print('Invalid reconstruction SRS')
        sys.exit(0)

    reconstructionSettings = reconstruction.getSettings()
    reconstructionSettings.geometryPrecisionMode = ccmasterkernel.bindings.GeometryPrecisionMode.GeometryPrecision_medium
    reconstruction.setSettings(reconstructionSettings)

    
    tiling = reconstruction.getTiling()
    tiling.autoOrigin = False
    tiling.customOrigin = ccmasterkernel.Point3d(centerPointX,centerPointY,centerPointZ)
    
    reconstruction.setTiling(tiling)
    # Add by lipo end

    blockAT.addReconstruction(reconstruction)
    #print('Reconstruction item created.')
    return reconstruction


# --------------------------------------------------------------------
# Production
# --------------------------------------------------------------------
def production(project,reconstruction,pictureSize):
    production = ccmasterkernel.Production(reconstruction)
    production.addProductionJob( ccmasterkernel.TileProductionJob(production, reconstruction.getInternalTile(0)) )
    production.sortJobsAccordingToDistanceToCenter()
    reconstruction.addProduction(production)

    #print('ProductionsDirPath:%s'%project.getProductionsDirPath())
    #print('ProductionsName:%s'%production.getName())

    production.setDriverName('OBJ')
    production.setName('Production_1')
    production.setDestination( os.path.join(project.getProductionsDirPath(), production.getName()) )
    #production.setName('Model')
    
    driverOptions = production.getDriverOptions()
    driverOptions.put_bool('TextureEnabled', True)
    driverOptions.put_int('TextureCompressionQuality', 75)
    driverOptions.put_int('MaximumTextureSize',int(pictureSize))
    
    driverOptions.writeXML( os.path.join(project.getProductionsDirPath(), "options.xml") )
    #print('2222222222222222222222222222222222222222222')
 
    production.setDriverOptions(driverOptions)

    #print(project.getProductionsDirPath())
    #print('Production item created.')

    productionSubmitError = production.submitProcessing()

    if not productionSubmitError.isNone():
        print('Error: Failed to submit production.')
        print(productionSubmitError.message)
        sys.exit(0)

    #print('The production job has been submitted and is waiting to be processed...')

    iPreviousProgress = 0
    iProgress = 0
    previousJobStatus = ccmasterkernel.JobStatus.Job_unknown

    while 1:
        jobStatus = production.getProductionJob(0).getJobStatus()

        if jobStatus != previousJobStatus:
            print(ccmasterkernel.jobStatusAsString(jobStatus))

        if jobStatus == ccmasterkernel.JobStatus.Job_failed or jobStatus == ccmasterkernel.JobStatus.Job_cancelled or jobStatus == ccmasterkernel.JobStatus.Job_completed:
            break

       # if iProgress != iPreviousProgress:
       #     print('%s%% - %s' % (iProgress,production.getProductionJob(0).getJobMessage()))

        iPreviousProgress = iProgress
        iProgress = production.getProductionJob(0).getJobProgress()
        time.sleep(1)
        production.updateStatus()
        previousJobStatus = jobStatus

    #print('')

    if jobStatus != ccmasterkernel.JobStatus.Job_completed:
        print('"Error: Incomplete production.')

        if production.getProductionJob(0).getJobMessage() != '':
            print(production.getProductionJob(0).getJobMessage())

    # --------------------------------------------------------------------
    # Report
    # --------------------------------------------------------------------
    #print('Production completed.')
    #print('Output directory: %s' % production.getDestination())

if __name__ == '__main__':
    reconstructionProcess(sys.argv[1:])